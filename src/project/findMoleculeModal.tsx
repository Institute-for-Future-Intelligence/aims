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
  similarMolecules: { name: string; formula: string; distance: number }[];
  setDialogVisible: (visible: boolean) => void;
  isDialogVisible: () => boolean;
}

const FindMoleculeModal = React.memo(
  ({ moleculeName, moleculeFormula, similarMolecules, setDialogVisible, isDialogVisible }: FindMoleculeModalProps) => {
    const language = useStore(Selector.language);
    const searchChemicalNotation = useStore(Selector.searchChemicalNotation) ?? ChemicalNotation.INCHI;
    const notationSearchThreshold = useStore(Selector.notationSearchThreshold) ?? 5;

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
        width={480}
        title={
          <div
            style={{ width: '100%', cursor: 'move' }}
            onMouseOver={() => setDragEnabled(true)}
            onMouseOut={() => setDragEnabled(false)}
          >
            <DiffOutlined /> {t('projectPanel.SimilarMolecules', lang)}
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
        <Space style={{ paddingBottom: '10px' }}>
          {moleculeName +
            ': ' +
            moleculeFormula +
            ', Notation: ' +
            searchChemicalNotation +
            ', Threshold: ' +
            notationSearchThreshold}
        </Space>
        {similarMolecules.length === 0 ? (
          <div>No similar molecules were found.</div>
        ) : (
          similarMolecules.map((value) => {
            return (
              <div key={value.name}>
                <Checkbox checked={true}>{value.name + ' (' + value.formula + '): ' + value.distance}</Checkbox>
              </div>
            );
          })
        )}
      </Modal>
    );
  },
);

export default FindMoleculeModal;
