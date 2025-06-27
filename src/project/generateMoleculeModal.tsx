/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Modal, Space } from 'antd';
import i18n from '../i18n/i18n.ts';
import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { OpenAIOutlined } from '@ant-design/icons';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { generateFormulaFromAtomJS, loadMolecule } from '../view/moleculeTools.ts';
import { MoleculeInterface } from '../types.ts';
import { setMessage } from '../helpers.tsx';
import { MolecularProperties } from '../models/MolecularProperties.ts';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase.ts';

export interface GenerateMoleculeModalProps {
  setDialogVisible: (visible: boolean) => void;
  isDialogVisible: () => boolean;
}

const { TextArea } = Input;

const GenerateMoleculeModal = React.memo(({ setDialogVisible, isDialogVisible }: GenerateMoleculeModalProps) => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const generateMoleculePrompt = useStore(Selector.generateMoleculePrompt);
  const setWaiting = usePrimitiveStore(Selector.setWaiting);
  const addMolecule = useStore(Selector.addMolecule);
  const setChanged = usePrimitiveStore(Selector.setChanged);

  const [dragEnabled, setDragEnabled] = useState<boolean>(false);
  const [bounds, setBounds] = useState<DraggableBounds>({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  } as DraggableBounds);
  const dragRef = useRef<HTMLDivElement | null>(null);

  const [prompt, setPrompt] = useState<string>(generateMoleculePrompt);

  useEffect(() => {
    setPrompt(generateMoleculePrompt);
  }, [generateMoleculePrompt]);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const resultRef = useRef<string | null>(null);

  const generate = async () => {
    const functions = getFunctions(app, 'us-east4');
    // connectFunctionsEmulator(functions, 'localhost', 5001);
    const callOpenAI = httpsCallable(functions, 'callOpenAI');

    const res = (await callOpenAI({
      text: prompt,
    })) as any;
    resultRef.current = res.data.text;
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
    setCommonStore((state) => {
      state.projectState.generateMoleculePrompt = prompt;
    });
    generate()
      .catch((e) => {
        setMessage('error', e.toString());
      })
      .then(() => {
        if (resultRef.current) {
          const mol = { name: 'chatgpt', data: resultRef.current } as MoleculeInterface;
          loadMolecule(mol, (result) => {
            console.log(resultRef.current);
            console.log(result);
            mol.name = result.name;
            const added = addMolecule(mol);
            if (added) {
              setCommonStore((state) => {
                state.projectState.selectedMolecule = mol;
                let molecularMass = 0;
                let heavyAtomCount = 0;
                for (const a of result._atoms) {
                  molecularMass += a.element.weight;
                  if (a.element.name !== 'H') heavyAtomCount++;
                }
                state.projectState.generatedMolecularProperties[result.name] = {
                  molecularMass,
                  heavyAtomCount,
                  formula: generateFormulaFromAtomJS(result._atoms),
                } as MolecularProperties;
              });
              setChanged(true);
            } else {
              setMessage('info', t('projectPanel.MoleculeAlreadyAdded', lang) + ': ' + mol.name, 3);
            }
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
        <TextArea
          rows={10}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
      </Space>
    </Modal>
  );
});

export default GenerateMoleculeModal;
