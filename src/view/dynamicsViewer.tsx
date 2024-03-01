/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Group } from 'three';
import { MoleculeData } from '../types';
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
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { loadMolecule, setProperties } from './moleculeTools.ts';

export interface DynamicsViewerProps {
  moleculeData: MoleculeData | null;
  style: MolecularViewerStyle;
  material: MolecularViewerMaterial;
  coloring: MolecularViewerColoring;
  selector?: string;
  setLoading?: (loading: boolean) => void;
  onPointerOver?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
}

const DynamicsViewer = React.memo(
  ({
    moleculeData,
    style,
    material,
    coloring,
    selector,
    setLoading,
    onPointerOver,
    onPointerLeave,
    onPointerDown,
  }: DynamicsViewerProps) => {
    const [complex, setComplex] = useState<any>();

    const groupRef = useRef<Group>(null);

    const { invalidate } = useThree();

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
      loadMolecule(moleculeData, processResult);
    }, [moleculeData?.name]);

    const processResult = (result: any) => {
      setComplex(result);
      let cx = 0;
      let cy = 0;
      let cz = 0;
      const n = result._atoms.length;
      for (let i = 0; i < n; i++) {
        const atom = result._atoms[i] as AtomJS;
        cx += atom.position.x;
        cy += atom.position.y;
        cz += atom.position.z;
      }
      if (n > 0) {
        cx /= n;
        cy /= n;
        cz /= n;
      }
      groupRef.current?.position.set(-cx, -cy, -cz);
      if (moleculeData) {
        setProperties(moleculeData, result._atoms.length, result._bonds.length);
      }
    };

    useEffect(() => {
      if (!groupRef.current || !mode) return;
      groupRef.current.children = [];
      if (!complex) return;
      if (setLoading) setLoading(true);

      groupRef.current.position.set(0, 0, 0);
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
          const boundingSphere = visual.getBoundaries().boundingSphere;
          usePrimitiveStore.getState().set((state) => {
            state.boundingSphereRadius = boundingSphere.radius;
          });
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

export default DynamicsViewer;
