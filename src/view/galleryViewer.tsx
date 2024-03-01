/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import PDBParser from '../lib/io/parsers/PDBParser';
import SDFParser from '../lib/io/parsers/SDFParser';
import XYZParser from '../lib/io/parsers/XYZParser';
import MOL2Parser from '../lib/io/parsers/MOL2Parser';
import CIFParser from '../lib/io/parsers/CIFParser';
import PubChemParser from '../lib/io/parsers/PubChemParser';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DirectionalLight, Group, Sphere } from 'three';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { MoleculeData } from '../types';
import AtomJS from '../lib/chem/Atom';
import { MolecularProperties } from '../models/MolecularProperties';
import ComplexVisual from '../lib/ComplexVisual';
import { ThreeEvent, useThree } from '@react-three/fiber';
import {
  COLORING_MAP,
  MATERIAL_MAP,
  MolecularViewerColoring,
  MolecularViewerMaterial,
  MolecularViewerStyle,
  STYLE_MAP,
} from './displayOptions';
import { getData } from '../internalDatabase';

export interface GalleryViewerProps {
  moleculeData: MoleculeData | null;
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  coloring: MolecularViewerColoring;
  selector?: string;
  lightRef?: React.RefObject<DirectionalLight>;
  setLoading?: (loading: boolean) => void;
  onPointerOver?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

const GalleryViewer = React.memo(
  ({
    moleculeData,
    style,
    material,
    coloring,
    selector,
    lightRef,
    setLoading,
    onPointerOver,
    onPointerLeave,
    onPointerDown,
  }: GalleryViewerProps) => {
    const getProvidedMolecularProperties = useStore(Selector.getProvidedMolecularProperties);
    const setMolecularProperties = useStore(Selector.setMolecularProperties);
    const projectViewerStyle = useStore(Selector.projectViewerStyle);
    const setParsedResult = useStore(Selector.setParsedResult);

    const [complex, setComplex] = useState<any>();

    const groupRef = useRef<Group>(null);

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
      if (!moleculeData) {
        setComplex(undefined);
        return;
      }
      const mol = getData(moleculeData.name);
      if (mol?.url) {
        fetch(mol.url).then((response) => {
          response.text().then((text) => {
            let url = mol.url;
            if (url) {
              if (url.includes('?')) {
                // sometimes the url has an appendix (not sure who adds it)
                url = url.substring(0, url.indexOf('?'));
              }
              let parser = null;
              const options = {};
              if (url.endsWith('.sdf')) parser = new SDFParser(text, options);
              else if (url.endsWith('.cif')) parser = new CIFParser(text, options);
              else if (url.endsWith('.pdb')) parser = new PDBParser(text, options);
              else if (url.endsWith('.pcj')) parser = new PubChemParser(text, options);
              else if (url.endsWith('.xyz')) parser = new XYZParser(text, options);
              else if (url.endsWith('.mol2')) parser = new MOL2Parser(text, options);
              if (parser) {
                // have to parse twice to create a distinct copy for common store
                // because deep copy using JSON does not work (circular references)
                parser.parse().then((result) => {
                  setParsedResult(moleculeData.name, result);
                });
                parser.parse().then((result) => {
                  processResult(result);
                });
              }
            }
          });
        });
      }
    }, [moleculeData?.name]);

    const processResult = (result: any) => {
      setComplex(result);

      // center the molecule
      const n = result._atoms.length;
      if (n > 0) {
        let cx = 0;
        let cy = 0;
        let cz = 0;
        for (let i = 0; i < n; i++) {
          const atom = result._atoms[i] as AtomJS;
          cx += atom.position.x;
          cy += atom.position.y;
          cz += atom.position.z;
        }
        cx /= n;
        cy /= n;
        cz /= n;
        groupRef.current?.position.set(-cx, -cy, -cz);
      }

      // set properties
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
            density: properties.density,
            boilingPoint: properties.boilingPoint,
            meltingPoint: properties.meltingPoint,
          } as MolecularProperties);
        }
      }
    };

    useEffect(() => {
      if (!groupRef.current || !mode) return;
      groupRef.current.children = [];
      if (!complex) return;
      if (setLoading) setLoading(true);

      // groupRef.current.position.set(0, 0, 0);
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
          if (!groupRef.current) return;
          groupRef.current.add(visual);
          onLoaded(visual.getBoundaries().boundingSphere);
          invalidate();
        })
        .finally(() => {
          if (setLoading) setLoading(false);
        });
    }, [complex, material, mode, colorer, selector]);

    return (
      <group
        ref={groupRef}
        onPointerOver={onPointerOver}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      />
    );
  },
);

export default GalleryViewer;
