/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Button, Input, Modal, Space } from 'antd';
import i18n from '../i18n/i18n.ts';
import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { OpenAIOutlined } from '@ant-design/icons';
import { OpenAI } from 'openai';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { parseSDF } from '../view/moleculeTools.ts';

export interface GenerateMoleculeModalProps {
  setDialogVisible: (visible: boolean) => void;
  isDialogVisible: () => boolean;
}

const { TextArea } = Input;

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const GenerateMoleculeModal = React.memo(({ setDialogVisible, isDialogVisible }: GenerateMoleculeModalProps) => {
  const language = useStore(Selector.language);
  const prompt = usePrimitiveStore(Selector.generateMoleculePrompt);
  const setWaiting = usePrimitiveStore(Selector.setWaiting);

  const [dragEnabled, setDragEnabled] = useState<boolean>(false);
  const [bounds, setBounds] = useState<DraggableBounds>({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  } as DraggableBounds);
  const dragRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const resultRef = useRef<string | null>(null);

  const generate = async () => {
    const response = await client.responses.create({
      model: 'o4-mini',
      input: prompt + ' It should have hydrogen atoms. Return a SDF file.',
    });
    resultRef.current = response.output_text;
  };

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
    setWaiting(true);
    generate()
      .catch((e) => {
        console.error(e);
      })
      .then(() => {
        if (resultRef.current) {
          parseSDF(resultRef.current, (result) => {
            console.log(resultRef.current);
            console.log(result);
          });
        }
      })
      .finally(() => {
        setWaiting(false);
      });
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
          <OpenAIOutlined /> {t('projectPanel.GenerateMolecule', lang)}
        </div>
      }
      open={isDialogVisible()}
      footer={[
        <Button key="Cancel" onClick={onCancel}>
          {t('word.Cancel', lang)}
        </Button>,
        <Button key="OK" type="primary" onClick={onOk}>
          {t('word.Generate', lang)}
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
      <Space direction={'vertical'} style={{ width: '100%', paddingBottom: '10px', paddingTop: '10px' }}>
        <Space>{i18n.t('projectPanel.WhatMoleculeDoYouWant', lang)}</Space>
        <TextArea rows={10} value={prompt} />
      </Space>
    </Modal>
  );
});

export default GenerateMoleculeModal;
