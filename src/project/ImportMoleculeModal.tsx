/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Button, Flex, Modal, Select, Space } from 'antd';
import i18n from '../i18n/i18n.ts';
import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { ImportOutlined } from '@ant-design/icons';
import { MoleculeType, ProjectType } from '../constants.ts';
import {
  biomolecules,
  commonMolecules,
  crystals,
  drugMolecules,
  hydrocarbonMolecules,
  monatomicMolecules,
} from '../internalDatabase.ts';

const { Option } = Select;

export interface ImportMoleculeModalProps {
  importByNames: () => void;
  setNames: (names: string[]) => void;
  getNames: () => string[];
  setDialogVisible: (visible: boolean) => void;
  isDialogVisible: () => boolean;
}

const ImportMoleculeModal = React.memo(
  ({ importByNames, setNames, getNames, setDialogVisible, isDialogVisible }: ImportMoleculeModalProps) => {
    const language = useStore(Selector.language);
    const projectType = useStore(Selector.projectType);
    const getProvidedMolecularProperties = useStore(Selector.getProvidedMolecularProperties);
    const molecules = useStore(Selector.molecules);

    const [moleculeType, setMoleculeType] = useState<MoleculeType>(
      projectType === ProjectType.DRUG_DISCOVERY ? MoleculeType.DRUG : MoleculeType.ANY,
    );
    const [dragEnabled, setDragEnabled] = useState<boolean>(false);
    const [bounds, setBounds] = useState<DraggableBounds>({ left: 0, top: 0, bottom: 0, right: 0 } as DraggableBounds);
    const dragRef = useRef<HTMLDivElement | null>(null);

    const { t } = useTranslation();
    const lang = useMemo(() => {
      return { lng: language };
    }, [language]);

    const onStart = (event: DraggableEvent, uiData: DraggableData) => {
      if (dragRef.current) {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = dragRef.current.getBoundingClientRect();
        setBounds({
          left: -targetRect.left + uiData.x,
          right: clientWidth - (targetRect.right - uiData.x),
          top: -targetRect.top + uiData.y,
          bottom: clientHeight - (targetRect?.bottom - uiData.y),
        });
      }
    };

    const onOk = () => {
      const names = getNames();
      if (names) {
        importByNames();
        setDialogVisible(false);
      }
    };

    const onCancel = () => {
      setDialogVisible(false);
    };

    const allMolecules = useMemo(() => {
      return [
        ...drugMolecules,
        ...hydrocarbonMolecules,
        ...monatomicMolecules,
        ...crystals,
        ...biomolecules,
        ...commonMolecules,
      ];
    }, []);

    const collection = useMemo(() => {
      if (moleculeType === MoleculeType.COMMON) return commonMolecules;
      if (moleculeType === MoleculeType.DRUG) return drugMolecules;
      if (moleculeType === MoleculeType.HYDROCARBON) return hydrocarbonMolecules;
      if (moleculeType === MoleculeType.MONATOMIC) return monatomicMolecules;
      if (moleculeType === MoleculeType.CRYSTAL) return crystals;
      if (moleculeType === MoleculeType.BIOMOLECULE) return biomolecules;
      return allMolecules;
    }, [moleculeType]);

    const total =
      commonMolecules.length +
      hydrocarbonMolecules.length +
      biomolecules.length +
      drugMolecules.length +
      monatomicMolecules.length +
      crystals.length;

    const alreadySelected = (name: string) => {
      for (const m of molecules) {
        if (m.name === name) return true;
      }
      return false;
    };

    const getUnusedNames = (): string[] => {
      const names = getNames();
      const s = [];
      for (const n of names) {
        let used = false;
        for (const m of molecules) {
          if (m.name === n) {
            used = true;
            break;
          }
        }
        if (!used) s.push(n);
      }
      return s;
    };

    return (
      <Modal
        width={480}
        title={
          <div
            style={{ width: '100%', cursor: 'move' }}
            onMouseOver={() => setDragEnabled(true)}
            onMouseOut={() => setDragEnabled(false)}
          >
            <ImportOutlined /> {t('projectPanel.SelectMolecule', lang)}
          </div>
        }
        open={isDialogVisible()}
        footer={[
          <Button key="Cancel" onClick={onCancel}>
            {t('word.Cancel', lang)}
          </Button>,
          <Button key="OK" type="primary" onClick={onOk} disabled={!getNames()}>
            {t('word.Import', lang)}
          </Button>,
        ]}
        onCancel={onCancel}
        modalRender={(modal) => (
          <Draggable
            nodeRef={dragRef}
            disabled={!dragEnabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={dragRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Space direction={'horizontal'} style={{ paddingBottom: '10px' }}>
          <Space direction={'horizontal'} style={{ width: '120px' }}>
            {i18n.t('projectPanel.MoleculeType', lang) + ':'}
          </Space>
          <Select
            style={{ width: '300px' }}
            value={moleculeType}
            onChange={(value: MoleculeType) => {
              setMoleculeType(value);
              setNames([]);
            }}
          >
            <Option key={MoleculeType.ANY} value={MoleculeType.ANY}>
              {t('term.Any', lang) + ' (' + total + ')'}
            </Option>
            <Option key={MoleculeType.COMMON} value={MoleculeType.COMMON}>
              {t('term.CommonMolecules', lang) + ' (' + commonMolecules.length + ')'}
            </Option>
            <Option key={MoleculeType.HYDROCARBON} value={MoleculeType.HYDROCARBON}>
              {t('term.HydrocarbonMolecules', lang) + ' (' + hydrocarbonMolecules.length + ')'}
            </Option>
            <Option key={MoleculeType.BIOMOLECULE} value={MoleculeType.BIOMOLECULE}>
              {t('term.Biomolecules', lang) + ' (' + biomolecules.length + ')'}
            </Option>
            <Option key={MoleculeType.DRUG} value={MoleculeType.DRUG}>
              {t('term.DrugMolecules', lang) + ' (' + drugMolecules.length + ')'}
            </Option>
            <Option key={MoleculeType.MONATOMIC} value={MoleculeType.MONATOMIC}>
              {t('term.Monatomic', lang) + ' (' + monatomicMolecules.length + ')'}
            </Option>
            <Option key={MoleculeType.CRYSTAL} value={MoleculeType.CRYSTAL}>
              {t('term.Crystal', lang) + ' (' + crystals.length + ')'}
            </Option>
          </Select>
        </Space>
        <Space direction={'horizontal'} align={'start'}>
          <Space direction={'horizontal'} style={{ width: '120px' }}>
            {i18n.t('projectPanel.MolecularName', lang) + ':'}
          </Space>
          <Space direction={'vertical'} style={{ width: '300px' }}>
            <Select
              mode="multiple"
              allowClear
              showSearch
              maxCount={10}
              style={{ width: '300px' }}
              value={getUnusedNames()}
              onChange={(values: string[]) => {
                setNames(values);
              }}
            >
              {collection.map((d, i) => {
                const prop = getProvidedMolecularProperties(d.name);
                if (!alreadySelected(d.name)) {
                  const formula = prop?.formula;
                  return (
                    <Option key={`${i}-${d.name}`} value={d.name}>
                      {d.name + (formula ? ' (' + formula + ')' : '')}
                    </Option>
                  );
                }
              })}
            </Select>
            <Flex key="note" justify={'left'}>
              <Space style={{ fontSize: '10px' }}>{t('projectPanel.TypeToSearch', lang)}</Space>
            </Flex>
          </Space>
        </Space>
      </Modal>
    );
  },
);

export default ImportMoleculeModal;
