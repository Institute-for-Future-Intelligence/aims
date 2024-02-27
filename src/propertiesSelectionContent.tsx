/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Checkbox } from 'antd';
import { useStore } from './stores/common.ts';
import * as Selector from './stores/selector';
import { usePrimitiveStore } from './stores/commonPrimitive.ts';
import { useTranslation } from 'react-i18next';
import { updateHiddenProperties } from './cloudProjectUtil.ts';

interface PropertiesSelectionContentProps {
  updateHiddenFlag: () => void;
}

const PropertiesSelectionContent = React.memo(({ updateHiddenFlag }: PropertiesSelectionContentProps) => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const user = useStore(Selector.user);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const hiddenProperties = useStore(Selector.hiddenProperties);
  const projectOwner = useStore(Selector.projectOwner);
  const projectTitle = useStore(Selector.projectTitle);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);
  const isOwner = user.uid === projectOwner;

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

  const localSelectProperty = (selected: boolean, property: string) => {
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
  };

  const selectProperty = (selected: boolean, property: string) => {
    propertySelectionChangedRef.current = true;
    if (isOwner) {
      if (user.uid && projectTitle) {
        updateHiddenProperties(user.uid, projectTitle, property, !selected).then(() => {
          localSelectProperty(selected, property);
        });
      }
    } else {
      localSelectProperty(selected, property);
    }
    setChanged(true);
  };

  return (
    <div>
      <Checkbox
        onChange={(e) => {
          atomCountSelectionRef.current = e.target.checked;
          selectProperty(atomCountSelectionRef.current, 'atomCount');
          updateHiddenFlag();
        }}
        checked={atomCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.AtomCount', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          bondCountSelectionRef.current = e.target.checked;
          selectProperty(bondCountSelectionRef.current, 'bondCount');
          updateHiddenFlag();
        }}
        checked={bondCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.BondCount', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          massSelectionRef.current = e.target.checked;
          selectProperty(massSelectionRef.current, 'molecularMass');
          updateHiddenFlag();
        }}
        checked={massSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.MolecularMass', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          logPSelectionRef.current = e.target.checked;
          selectProperty(logPSelectionRef.current, 'logP');
          updateHiddenFlag();
        }}
        checked={logPSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>log P</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          hBondDonorCountSelectionRef.current = e.target.checked;
          selectProperty(hBondDonorCountSelectionRef.current, 'hydrogenBondDonorCount');
          updateHiddenFlag();
        }}
        checked={hBondDonorCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.HydrogenBondDonorCount', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          hBondAcceptorCountSelectionRef.current = e.target.checked;
          selectProperty(hBondAcceptorCountSelectionRef.current, 'hydrogenBondAcceptorCount');
          updateHiddenFlag();
        }}
        checked={hBondAcceptorCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.HydrogenBondAcceptorCount', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          rotatableBondCountSelectionRef.current = e.target.checked;
          selectProperty(rotatableBondCountSelectionRef.current, 'rotatableBondCount');
          updateHiddenFlag();
        }}
        checked={rotatableBondCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.RotatableBondCount', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          polarSurfaceAreaSelectionRef.current = e.target.checked;
          selectProperty(polarSurfaceAreaSelectionRef.current, 'polarSurfaceArea');
          updateHiddenFlag();
        }}
        checked={polarSurfaceAreaSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.PolarSurfaceArea', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          heavyAtomCountSelectionRef.current = e.target.checked;
          selectProperty(heavyAtomCountSelectionRef.current, 'heavyAtomCount');
          updateHiddenFlag();
        }}
        checked={heavyAtomCountSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.HeavyAtomCount', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          complexitySelectionRef.current = e.target.checked;
          selectProperty(complexitySelectionRef.current, 'complexity');
          updateHiddenFlag();
        }}
        checked={complexitySelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.Complexity', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          densitySelectionRef.current = e.target.checked;
          selectProperty(densitySelectionRef.current, 'density');
          updateHiddenFlag();
        }}
        checked={densitySelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.Density', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          boilingPointSelectionRef.current = e.target.checked;
          selectProperty(boilingPointSelectionRef.current, 'boilingPoint');
          updateHiddenFlag();
        }}
        checked={boilingPointSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.BoilingPoint', lang)}</span>
      </Checkbox>
      <br />
      <Checkbox
        onChange={(e) => {
          meltingPointSelectionRef.current = e.target.checked;
          selectProperty(meltingPointSelectionRef.current, 'meltingPoint');
          updateHiddenFlag();
        }}
        checked={meltingPointSelectionRef.current}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.MeltingPoint', lang)}</span>
      </Checkbox>
    </div>
  );
});

export default PropertiesSelectionContent;
