/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Button, Modal, Select, Space } from 'antd';
import i18n from './i18n/i18n';
import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';
import { sampleMolecules } from './internalDatabase';
import { ImportOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface ImportMoleculeModalProps {
  importByName: (name: string) => void;
  setName: (title: string) => void;
  getName: () => string;
  setDialogVisible: (visible: boolean) => void;
  isDialogVisible: () => boolean;
}

const ImportMoleculeModal = React.memo(
  ({ importByName, setName, getName, setDialogVisible, isDialogVisible }: ImportMoleculeModalProps) => {
    const language = useStore(Selector.language);

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
      const name = getName();
      if (name) {
        importByName(name);
        setDialogVisible(false);
      }
    };

    const onCancel = () => {
      setDialogVisible(false);
    };

    return (
      <Modal
        width={450}
        title={
          <div
            style={{ width: '100%', cursor: 'move' }}
            onMouseOver={() => setDragEnabled(true)}
            onMouseOut={() => setDragEnabled(false)}
          >
            <ImportOutlined /> {t('projectPanel.ImportMolecule', lang)}
          </div>
        }
        open={isDialogVisible()}
        footer={[
          <Button key="Cancel" onClick={onCancel}>
            {t('word.Cancel', lang)}
          </Button>,
          <Button key="OK" type="primary" onClick={onOk} disabled={!getName()}>
            {t('word.OK', lang)}
          </Button>,
        ]}
        onCancel={onCancel}
        modalRender={(modal) => (
          <Draggable disabled={!dragEnabled} bounds={bounds} onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={dragRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Space direction={'horizontal'}>
          <Space direction={'horizontal'} style={{ width: '150px' }}>
            {i18n.t('projectPanel.MoleculeName', lang)}:
          </Space>
          <Select
            style={{ width: '240px' }}
            value={getName()}
            showSearch
            onChange={(value: string) => {
              setName(value);
            }}
          >
            {sampleMolecules.map((d, i) => (
              <Option key={`${i}-${d.name}`} value={d.name}>
                {d.name}
              </Option>
            ))}
          </Select>
        </Space>
      </Modal>
    );
  },
);

export default ImportMoleculeModal;
