/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import PDBParser from '../lib/io/parsers/PDBParser';
import SDFParser from '../lib/io/parsers/SDFParser';
import XYZParser from '../lib/io/parsers/XYZParser';
import MOL2Parser from '../lib/io/parsers/MOL2Parser';
import CIFParser from '../lib/io/parsers/CIFParser';
import PubChemParser from '../lib/io/parsers/PubChemParser';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DirectionalLight, Group, Sphere, Vector3 } from 'three';
import { MoleculeTS } from '../models/MoleculeTS';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { MoleculeData } from '../types';
import AtomJS from '../lib/chem/Atom';
import BondJS from '../lib/chem/Bond';
import { AtomTS } from '../models/AtomTS';
import { BondTS } from '../models/BondTS';
import { Util } from '../Util';
import { MolecularProperties } from '../models/MolecularProperties';
import ComplexVisual from '../lib/ComplexVisual';
import { useThree } from '@react-three/fiber';
import {
  COLORING_MAP,
  MATERIAL_MAP,
  MolecularViewerColoring,
  MolecularViewerMaterial,
  MolecularViewerStyle,
  STYLE_MAP,
} from './displayOptions';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { getSample } from '../internalDatabase';
import { useRefStore } from '../stores/commonRef';

export interface MolecularViewerProps {
  moleculeData: MoleculeData | null;
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  coloring: MolecularViewerColoring;
  chamber?: boolean;
  selector?: string;
  lightRef?: React.RefObject<DirectionalLight>;
  setLoading?: (loading: boolean) => void;
}

const MolecularViewer = React.memo(
  ({ moleculeData, style, material, coloring, chamber, selector, lightRef, setLoading }: MolecularViewerProps) => {
    const setCommonStore = useStore(Selector.set);
    const chemicalElements = useStore(Selector.chemicalElements);
    const getChemicalElement = useStore(Selector.getChemicalElement);
    const getProvidedMolecularProperties = useStore(Selector.getProvidedMolecularProperties);
    const setMolecularProperties = useStore(Selector.setMolecularProperties);
    const projectViewerMaterial = useStore(Selector.projectViewerMaterial);
    const projectViewerStyle = useStore(Selector.projectViewerStyle);
    const parsedResultsMap = useStore(Selector.parsedResultsMap);
    const setParsedResult = useStore(Selector.setParsedResult);
    const testMolecule = useStore(Selector.testMolecule);
    const testMoleculeRotation = useStore.getState().projectState.testMoleculeRotation ?? [0, 0, 0];
    const testMoleculeTranslation = useStore.getState().projectState.testMoleculeTranslation ?? [0, 0, 0];

    const [complex, setComplex] = useState<any>();

    const mainGroupRef = useRef<Group>(null);
    const originalPositions = useRef<Vector3[]>([]);

    const { invalidate, camera } = useThree();

    const onLoaded = (boundingSphere: Sphere) => {
      let ratio = 3;
      switch (projectViewerStyle) {
        case MolecularViewerStyle.SpaceFilling:
        case MolecularViewerStyle.ContactSurface:
        case MolecularViewerStyle.SolventExcludedSurface:
          ratio = 4;
          break;
        case MolecularViewerStyle.QuickSurface:
        case MolecularViewerStyle.SolventAccessibleSurface:
          ratio = 5;
          break;
      }
      const r = ratio * boundingSphere.radius;
      camera.position.set(r, r, r);
      camera.rotation.set(0, 0, 0);
      camera.up.set(0, 0, 1);
      camera.lookAt(0, 0, 0);
      lightRef?.current?.position.set(r, r + 1, r);
    };

    const mode = useMemo(() => {
      return STYLE_MAP.get(style);
    }, [style]);

    const colorer = useMemo(() => {
      return COLORING_MAP.get(coloring);
    }, [coloring]);

    useEffect(() => {
      if (testMolecule && chamber) {
        originalPositions.current.length = 0;
        const complex = parsedResultsMap.get(testMolecule.name);
        if (complex) {
          for (const a of complex._atoms) {
            originalPositions.current.push(a.position.clone());
          }
        }
      }
    }, [testMolecule, parsedResultsMap]);

    useEffect(() => {
      if (!moleculeData) {
        setComplex(undefined);
        return;
      }
      const mol = getSample(moleculeData.name);
      if (mol?.url) {
        fetch(mol.url).then((response) => {
          response.text().then((text) => {
            const url = mol.url;
            if (url) {
              let parser = null;
              const options = {};
              if (url.endsWith('.sdf')) parser = new SDFParser(text, options);
              else if (url.endsWith('.cif')) parser = new CIFParser(text, options);
              else if (url.endsWith('.pdb')) parser = new PDBParser(text, options);
              else if (url.endsWith('.pcj')) parser = new PubChemParser(text, options);
              else if (url.endsWith('.xyz')) parser = new XYZParser(text, options);
              else if (url.endsWith('.mol2')) parser = new MOL2Parser(text, options);
              if (parser) {
                parser.parse().then((result) => {
                  processResult(result);
                });
                if (!chamber) {
                  // have to parse again to create a distinct copy for common store
                  // because deep copy using JSON does not work (circular references)
                  parser.parse().then((result) => {
                    setParsedResult(moleculeData.name, result);
                  });
                }
              }
            }
          });
        });
      }
    }, [moleculeData, chemicalElements]);

    const processResult = (result: any) => {
      setComplex(result);
      if (chamber) {
        const name = result.name;
        const metadata = result.metadata;
        const atoms: AtomTS[] = [];
        for (let i = 0; i < result._atoms.length; i++) {
          const atom = result._atoms[i] as AtomJS;
          const elementSymbol = Util.capitalizeFirstLetter(atom.element.name);
          const element = getChemicalElement(elementSymbol);
          if (element) {
            atoms.push({
              elementSymbol,
              position: atom.position.clone(),
            } as AtomTS);
          }
        }
        const bonds: BondTS[] = [];
        for (let i = 0; i < result._bonds.length; i++) {
          const bond = result._bonds[i] as BondJS;
          const atom1 = bond._left;
          const atom2 = bond._right;
          const elementSymbol1 = atom1.element.name;
          const elementSymbol2 = atom2.element.name;
          bonds.push(
            new BondTS(
              {
                elementSymbol: elementSymbol1,
                position: new Vector3(atom1.position.x, atom1.position.y, atom1.position.z),
              } as AtomTS,
              {
                elementSymbol: elementSymbol2,
                position: new Vector3(atom2.position.x, atom2.position.y, atom2.position.z),
              } as AtomTS,
            ),
          );
        }
        const residues = result._residues;
        const chains = result._chains;
        const structures = result.structures;
        const molecules = result._molecules;
        setCommonStore((state) => {
          state.targetData = { name, metadata, atoms, bonds, residues, chains, structures, molecules } as MoleculeTS;
        });
      }
      if (moleculeData) {
        const properties = getProvidedMolecularProperties(moleculeData.name);
        if (properties) {
          setMolecularProperties(moleculeData.name, {
            atomCount: result._atoms.length,
            bondCount: result._bonds.length,
            molecularMass: properties.molecularMass,
            logP: properties.logP,
            hydrogenBondDonorCount: properties.hydrogenBondDonorCount,
            hydrogenBondAcceptorCount: properties.hydrogenBondAcceptorCount,
            rotatableBondCount: properties.rotatableBondCount,
            polarSurfaceArea: properties.polarSurfaceArea,
            heavyAtomCount: properties.heavyAtomCount,
            complexity: properties.complexity,
          } as MolecularProperties);
        }
      }
    };

    useEffect(() => {
      if (!mainGroupRef.current || !mode) return;
      mainGroupRef.current.children = [];
      if (!complex) return;
      if (setLoading) setLoading(true);

      mainGroupRef.current.position.set(0, 0, 0);
      const visual = new ComplexVisual(complex.name, complex);
      const reps = [
        {
          mode: mode,
          colorer: colorer,
          selector: selector ?? 'all',
          material: MATERIAL_MAP.get(material),
        },
      ];
      visual.resetReps(reps);
      visual
        .rebuild()
        .then(() => {
          if (!mainGroupRef.current) return;
          mainGroupRef.current.add(visual);
          const boundingSphere = visual.getBoundaries().boundingSphere;
          const offset = boundingSphere.center.clone().multiplyScalar(-1);
          mainGroupRef.current.position.copy(offset);
          if (chamber) {
            usePrimitiveStore.getState().set((state) => {
              state.boundingSphereRadius = boundingSphere.radius;
            });
          } else {
            onLoaded(boundingSphere);
          }
          invalidate();
        })
        .finally(() => {
          if (setLoading) setLoading(false);
        });
    }, [complex, material, mode, colorer, selector]);

    const testMoleculeRef = useRef<Group>(null);

    useEffect(() => {
      if (!chamber) return;
      if (testMoleculeRef.current) {
        testMoleculeRef.current.children = [];
        if (testMolecule) {
          const complexTestMolecule = parsedResultsMap.get(testMolecule.name);
          if (complexTestMolecule) {
            const visualTestMolecule = new ComplexVisual(testMolecule.name, complexTestMolecule);
            visualTestMolecule.resetReps([
              {
                mode: STYLE_MAP.get(projectViewerStyle),
                colorer: COLORING_MAP.get(MolecularViewerColoring.Element),
                selector: 'all',
                material: MATERIAL_MAP.get(projectViewerMaterial),
              },
            ]);
            visualTestMolecule.rebuild().then(() => {
              if (!testMoleculeRef.current) return;
              testMoleculeRef.current.add(visualTestMolecule);
              invalidate();
            });
          }
          useRefStore.setState((state) => ({ testMoleculeRef: testMoleculeRef }));
        }
      }
    }, [testMolecule, parsedResultsMap, projectViewerStyle, projectViewerMaterial]);

    return (
      <>
        <group
          name={'Main'}
          ref={mainGroupRef}
          // FIXME: adding this would slow down the viewer significantly
          // onContextMenu={(e) => {
          //   e.stopPropagation();
          //   usePrimitiveStore.getState().set((state) => {
          //     state.contextMenuObjectType = ObjectType.Molecule;
          //   });
          // }}
        />
        <group
          name={'Test'}
          ref={testMoleculeRef}
          position={[testMoleculeTranslation[0], testMoleculeTranslation[1], testMoleculeTranslation[2]]}
          rotation={[testMoleculeRotation[0], testMoleculeRotation[1], testMoleculeRotation[2]]}
        />
      </>
    );
  },
);

export default MolecularViewer;
