/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Col, Modal, Row } from 'antd';
import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { DiffOutlined, InfoCircleOutlined } from '@ant-design/icons';

export interface FindMoleculeModalProps {
  moleculeName: string;
  moleculeFormula: string;
  similarMoleculesByInChI: { name: string; formula: string; distance: number }[];
  similarMoleculesBySmiles: { name: string; formula: string; distance: number }[];
  importByNames: (names: string[]) => void;
  setDialogVisible: (visible: boolean) => void;
  isDialogVisible: () => boolean;
}

const FindMoleculeModal = React.memo(
  ({
    moleculeName,
    moleculeFormula,
    similarMoleculesByInChI,
    similarMoleculesBySmiles,
    importByNames,
    setDialogVisible,
    isDialogVisible,
  }: FindMoleculeModalProps) => {
    const language = useStore(Selector.language);
    const molecules = useStore(Selector.molecules);

    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const [dragEnabled, setDragEnabled] = useState<boolean>(false);
    const [bounds, setBounds] = useState<DraggableBounds>({ left: 0, top: 0, bottom: 0, right: 0 } as DraggableBounds);
    const dragRef = useRef<HTMLDivElement | null>(null);
    const selectionRef = useRef<string[]>([]);

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
      importByNames(selectionRef.current);
      setDialogVisible(false);
    };

    const onCancel = () => {
      setDialogVisible(false);
    };

    const alreadyImported = (name: string) => {
      for (const m of molecules) {
        if (m.name === name) return true;
      }
      return false;
    };

    const selectMolecule = (checked: boolean, name: string) => {
      if (checked) {
        if (!selectionRef.current.includes(name)) {
          selectionRef.current.push(name);
        }
      } else {
        const index = selectionRef.current.indexOf(name);
        if (index !== -1) {
          selectionRef.current.splice(index, 1);
        }
      }
      setUpdateFlag(!updateFlag);
    };

    return (
      <Modal
        width={640}
        title={
          <div
            style={{ width: '100%', cursor: 'move' }}
            onMouseOver={() => setDragEnabled(true)}
            onMouseOut={() => setDragEnabled(false)}
          >
            <DiffOutlined />{' '}
            {t('projectPanel.MostSimilarMolecules', lang) + ' ' + moleculeName + ' (' + moleculeFormula + ')'}
          </div>
        }
        destroyOnClose={true}
        open={isDialogVisible()}
        afterOpenChange={(open: boolean) => {
          if (open) {
            selectionRef.current = [];
            setUpdateFlag(!updateFlag);
          }
        }}
        footer={[
          <InfoCircleOutlined key={'Info'} style={{ paddingRight: '5px' }} />,
          <span
            key={'Note'}
            style={{
              fontSize: '11px',
              paddingRight: '10px',
            }}
          >
            {t('projectPanel.LimitedToInternalDatabase', lang)}
          </span>,
          <Button key="Cancel" onClick={onCancel}>
            {t('word.Cancel', lang)}
          </Button>,
          <Button key="OK" type="primary" onClick={onOk} disabled={selectionRef.current.length === 0}>
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
        <Row style={{ width: '100%', paddingTop: '10px', paddingBottom: '10px' }}>
          <Col style={{ paddingRight: '30px' }}>
            <span title={t('tooltip.inchiFormat', lang)}>InChI {t('word.Results', lang)}</span>
            {similarMoleculesByInChI.length === 0 ? (
              <div>{t('message.NoSimilarMoleculesWereFound', lang)}</div>
            ) : (
              similarMoleculesByInChI.map((value) => {
                if (alreadyImported(value.name)) return;
                return (
                  <div key={value.name}>
                    <Checkbox onChange={(e) => selectMolecule(e.target.checked, value.name)}>
                      {value.name + ' (' + value.formula + ') '}
                      <span style={{ fontSize: '10px' }}>
                        <i>D</i>
                        <sub>L</sub>={value.distance}
                      </span>
                    </Checkbox>
                  </div>
                );
              })
            )}
          </Col>
          <Col>
            <span title={t('tooltip.smilesFormat', lang)}>SMILES {t('word.Results', lang)}</span>
            {similarMoleculesBySmiles.length === 0 ? (
              <div>{t('message.NoSimilarMoleculesWereFound', lang)}</div>
            ) : (
              similarMoleculesBySmiles.map((value) => {
                if (alreadyImported(value.name)) return;
                return (
                  <div key={value.name}>
                    <Checkbox onChange={(e) => selectMolecule(e.target.checked, value.name)}>
                      {value.name + ' (' + value.formula + ')'}{' '}
                      <span style={{ fontSize: '10px' }}>
                        <i>D</i>
                        <sub>L</sub>={value.distance}
                      </span>
                    </Checkbox>
                  </div>
                );
              })
            )}
          </Col>
        </Row>
      </Modal>
    );
  },
);

export default FindMoleculeModal;
