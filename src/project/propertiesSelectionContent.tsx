/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Checkbox } from 'antd';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { useTranslation } from 'react-i18next';
import { UndoableCheck } from '../undo/UndoableCheck.ts';

interface PropertiesSelectionContentProps {
  updateHiddenFlag: () => void;
}

const PropertiesSelectionContent = React.memo(({ updateHiddenFlag }: PropertiesSelectionContentProps) => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const hiddenProperties = useStore(Selector.hiddenProperties);
  const addUndoable = useStore(Selector.addUndoable);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const propertySelectionChangedRef = useRef<boolean>(false);
  const atomCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('atomCount'));
  const bondCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('bondCount'));
  const massSelectionRef = useRef<boolean>(!hiddenProperties?.includes('molecularMass'));
  const logPSelectionRef = useRef<boolean>(!hiddenProperties?.includes('logP'));
  const hBondDonorCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('hydrogenBondDonorCount'));
  const hBondAcceptorCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('hydrogenBondAcceptorCount'));
  const rotatableBondCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('rotatableBondCount'));
  const polarSurfaceAreaSelectionRef = useRef<boolean>(!hiddenProperties?.includes('polarSurfaceArea'));
  const heavyAtomCountSelectionRef = useRef<boolean>(!hiddenProperties?.includes('heavyAtomCount'));
  const complexitySelectionRef = useRef<boolean>(!hiddenProperties?.includes('complexity'));
  const densitySelectionRef = useRef<boolean>(!hiddenProperties?.includes('density'));
  const boilingPointSelectionRef = useRef<boolean>(!hiddenProperties?.includes('boilingPoint'));
  const meltingPointSelectionRef = useRef<boolean>(!hiddenProperties?.includes('meltingPoint'));

  useEffect(() => {
    atomCountSelectionRef.current = !hiddenProperties?.includes('atomCount');
    bondCountSelectionRef.current = !hiddenProperties?.includes('bondCount');
    massSelectionRef.current = !hiddenProperties?.includes('molecularMass');
    logPSelectionRef.current = !hiddenProperties?.includes('logP');
    hBondDonorCountSelectionRef.current = !hiddenProperties?.includes('hydrogenBondDonorCount');
    hBondAcceptorCountSelectionRef.current = !hiddenProperties?.includes('hydrogenBondAcceptorCount');
    rotatableBondCountSelectionRef.current = !hiddenProperties?.includes('rotatableBondCount');
    polarSurfaceAreaSelectionRef.current = !hiddenProperties?.includes('polarSurfaceArea');
    heavyAtomCountSelectionRef.current = !hiddenProperties?.includes('heavyAtomCount');
    complexitySelectionRef.current = !hiddenProperties?.includes('complexity');
    densitySelectionRef.current = !hiddenProperties?.includes('density');
    boilingPointSelectionRef.current = !hiddenProperties?.includes('boilingPoint');
    meltingPointSelectionRef.current = !hiddenProperties?.includes('meltingPoint');
  }, [hiddenProperties]);

  const selectProperty = (selected: boolean, property: string) => {
    const undoable = {
      name: 'Toggle ' + property,
      timestamp: Date.now(),
      checked: selected,
      undo: () => {
        setProperty(!undoable.checked, property);
      },
      redo: () => {
        setProperty(undoable.checked, property);
      },
    } as UndoableCheck;
    addUndoable(undoable);
    setProperty(selected, property);
  };

  const setProperty = (selected: boolean, property: string) => {
    propertySelectionChangedRef.current = true;
    setCommonStore((state) => {
      if (state.projectState.hiddenProperties) {
        if (selected) {
          if (state.projectState.hiddenProperties.includes(property)) {
            state.projectState.hiddenProperties.splice(state.projectState.hiddenProperties.indexOf(property), 1);
          }
        } else {
          if (!state.projectState.hiddenProperties.includes(property)) {
            state.projectState.hiddenProperties.push(property);
          }
        }
      }
    });
    setChanged(true);
  };

  return (
    <div>
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          atomCountSelectionRef.current = e.target.checked;
          selectProperty(atomCountSelectionRef.current, 'atomCount');
          updateHiddenFlag();
        }}
        checked={atomCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.atomCount', lang)}>
          {t('projectPanel.AtomCount', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          bondCountSelectionRef.current = e.target.checked;
          selectProperty(bondCountSelectionRef.current, 'bondCount');
          updateHiddenFlag();
        }}
        checked={bondCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.bondCount', lang)}>
          {t('projectPanel.BondCount', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          massSelectionRef.current = e.target.checked;
          selectProperty(massSelectionRef.current, 'molecularMass');
          updateHiddenFlag();
        }}
        checked={massSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.molecularMass', lang)}>
          {t('projectPanel.MolecularMass', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          logPSelectionRef.current = e.target.checked;
          selectProperty(logPSelectionRef.current, 'logP');
          updateHiddenFlag();
        }}
        checked={logPSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.logP', lang)}>
          log P
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          hBondDonorCountSelectionRef.current = e.target.checked;
          selectProperty(hBondDonorCountSelectionRef.current, 'hydrogenBondDonorCount');
          updateHiddenFlag();
        }}
        checked={hBondDonorCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.hydrogenBondDonorCount', lang)}>
          {t('projectPanel.HydrogenBondDonorCount', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          hBondAcceptorCountSelectionRef.current = e.target.checked;
          selectProperty(hBondAcceptorCountSelectionRef.current, 'hydrogenBondAcceptorCount');
          updateHiddenFlag();
        }}
        checked={hBondAcceptorCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.hydrogenBondAcceptorCount', lang)}>
          {t('projectPanel.HydrogenBondAcceptorCount', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          rotatableBondCountSelectionRef.current = e.target.checked;
          selectProperty(rotatableBondCountSelectionRef.current, 'rotatableBondCount');
          updateHiddenFlag();
        }}
        checked={rotatableBondCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.rotatableBondCount', lang)}>
          {t('projectPanel.RotatableBondCount', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          polarSurfaceAreaSelectionRef.current = e.target.checked;
          selectProperty(polarSurfaceAreaSelectionRef.current, 'polarSurfaceArea');
          updateHiddenFlag();
        }}
        checked={polarSurfaceAreaSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.polarSurfaceArea', lang)}>
          {t('projectPanel.PolarSurfaceArea', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          heavyAtomCountSelectionRef.current = e.target.checked;
          selectProperty(heavyAtomCountSelectionRef.current, 'heavyAtomCount');
          updateHiddenFlag();
        }}
        checked={heavyAtomCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.heavyAtomCount', lang)}>
          {t('projectPanel.HeavyAtomCount', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          complexitySelectionRef.current = e.target.checked;
          selectProperty(complexitySelectionRef.current, 'complexity');
          updateHiddenFlag();
        }}
        checked={complexitySelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.complexity', lang)}>
          {t('projectPanel.Complexity', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          densitySelectionRef.current = e.target.checked;
          selectProperty(densitySelectionRef.current, 'density');
          updateHiddenFlag();
        }}
        checked={densitySelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.density', lang)}>
          {t('projectPanel.Density', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          boilingPointSelectionRef.current = e.target.checked;
          selectProperty(boilingPointSelectionRef.current, 'boilingPoint');
          updateHiddenFlag();
        }}
        checked={boilingPointSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.boilingPoint', lang)}>
          {t('projectPanel.BoilingPoint', lang)}
        </span>
      </Checkbox>
      <br />
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          meltingPointSelectionRef.current = e.target.checked;
          selectProperty(meltingPointSelectionRef.current, 'meltingPoint');
          updateHiddenFlag();
        }}
        checked={meltingPointSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }} title={t('tooltip.meltingPoint', lang)}>
          {t('projectPanel.MeltingPoint', lang)}
        </span>
      </Checkbox>
    </div>
  );
});

export default PropertiesSelectionContent;
