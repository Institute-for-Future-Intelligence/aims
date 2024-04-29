/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Modal, Space } from 'antd';
import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { DiffOutlined } from '@ant-design/icons';
import { ChemicalNotation } from '../constants.ts';

export interface FindMoleculeModalProps {
  moleculeName: string;
  moleculeFormula: string;
  similarMoleculesByInChI: { name: string; formula: string; distance: number }[];
  similarMoleculesBySmiles: { name: string; formula: string; distance: number }[];
  setDialogVisible: (visible: boolean) => void;
  isDialogVisible: () => boolean;
}

const FindMoleculeModal = React.memo(
  ({
    moleculeName,
    moleculeFormula,
    similarMoleculesByInChI,
    similarMoleculesBySmiles,
    setDialogVisible,
    isDialogVisible,
  }: FindMoleculeModalProps) => {
    const language = useStore(Selector.language);
    const numberOfMostSimilarMolecules = useStore(Selector.numberOfMostSimilarMolecules) ?? 5;

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
      setDialogVisible(false);
    };

    const onCancel = () => {
      setDialogVisible(false);
    };

    return (
      <Modal
        width={600}
        title={
          <div
            style={{ width: '100%', cursor: 'move' }}
            onMouseOver={() => setDragEnabled(true)}
            onMouseOut={() => setDragEnabled(false)}
          >
            <DiffOutlined />{' '}
            {t('projectPanel.SimilarMolecules', lang) + ': ' + moleculeName + ' (' + moleculeFormula + ')'}
          </div>
        }
        open={isDialogVisible()}
        footer={[
          <Button key="Cancel" onClick={onCancel}>
            {t('word.Cancel', lang)}
          </Button>,
          <Button key="OK" type="primary" onClick={onOk}>
            {t('word.OK', lang)}
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
        <Space direction={'horizontal'} style={{ width: '100%', paddingTop: '20px', paddingBottom: '10px' }}>
          <Space direction={'vertical'} style={{ paddingRight: '10px' }}>
            <span>{t('projectPanel.UseDescriptor', lang) + ': '}InChI</span>
            {similarMoleculesByInChI.length === 0 ? (
              <div>{t('message.NoSimilarMoleculesWereFound', lang)}</div>
            ) : (
              similarMoleculesByInChI.map((value) => {
                return (
                  <div key={value.name}>
                    <Checkbox>{value.name + ' (' + value.formula + '), d=' + value.distance}</Checkbox>
                  </div>
                );
              })
            )}
          </Space>
          <Space direction={'vertical'}>
            <span>{t('projectPanel.UseDescriptor', lang) + ': '}SMILES</span>
            {similarMoleculesBySmiles.length === 0 ? (
              <div>{t('message.NoSimilarMoleculesWereFound', lang)}</div>
            ) : (
              similarMoleculesBySmiles.map((value) => {
                return (
                  <div key={value.name}>
                    <Checkbox>{value.name + ' (' + value.formula + '), d=' + value.distance}</Checkbox>
                  </div>
                );
              })
            )}
          </Space>
        </Space>
      </Modal>
    );
  },
);

export default FindMoleculeModal;
