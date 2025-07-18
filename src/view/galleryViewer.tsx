/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DirectionalLight, Group, Mesh, Sphere, Vector3 } from 'three';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { MoleculeInterface } from '../types';
import AtomJS from '../lib/chem/Atom';
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
import { generateFormulaFromAtomJS, loadMolecule, storeMoleculeData } from './moleculeTools.ts';
import { Atom } from '../models/Atom.ts';
import { RadialBond } from '../models/RadialBond.ts';

export interface GalleryViewerProps {
  molecule: MoleculeInterface;
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
    molecule,
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
    const setCommonStore = useStore(Selector.set);
    const projectViewerStyle = useStore(Selector.projectViewerStyle);
    const removeMoleculeByName = useStore(Selector.removeMoleculeByName);

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
      if (!molecule) {
        setComplex(undefined);
        return;
      }
      loadMolecule(molecule, processResult, removeMoleculeByName);
    }, [molecule]);

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
        const atoms: Atom[] = [];
        for (let i = 0; i < n; i++) {
          const atom = result._atoms[i] as AtomJS;
          const x = atom.position.x - cx;
          const y = atom.position.y - cy;
          const z = atom.position.z - cz;
          atoms.push(new Atom(atom.index, atom.element.name, new Vector3(x, y, z)));
        }
        const radialBonds: RadialBond[] = [];
        for (const b of result._bonds) {
          radialBonds.push(new RadialBond(atoms[b._left.index], atoms[b._right.index]));
        }
        storeMoleculeData(molecule, atoms, radialBonds);
        setCommonStore((state) => {
          const p = state.projectState.generatedMolecularProperties[molecule.name];
          if (p) p.formula = generateFormulaFromAtomJS(result._atoms);
        });
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
      return () => {
        if (groupRef.current) {
          groupRef.current.traverse((obj) => {
            if (obj instanceof Mesh) {
              obj.geometry.dispose();
              obj.material.dispose();
            }
          });
        }
      };
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
