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
import { AudioOutlined, AudioMutedOutlined, WarningOutlined } from '@ant-design/icons';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { generateFormulaFromAtomJS, loadMolecule } from '../view/moleculeTools.ts';
import { MoleculeInterface } from '../types.ts';
import { setMessage } from '../helpers.tsx';
import { MolecularProperties } from '../models/MolecularProperties.ts';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase.ts';
import GenaiImage from '../assets/genai.png';
import { Audio } from 'react-loader-spinner';
import useSpeechToText, { ResultType } from 'react-hook-speech-to-text';
import { callAzureOpenAI } from '../../functions/src/callAzureOpenAI.ts';

export interface GenerateMoleculeModalProps {
  setDialogVisible: (visible: boolean) => void;
  isDialogVisible: () => boolean;
}

const { TextArea } = Input;

const GenerateMoleculeModal = React.memo(({ setDialogVisible, isDialogVisible }: GenerateMoleculeModalProps) => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const generateMoleculePrompt = useStore(Selector.generateMoleculePrompt);
  const setGenerating = usePrimitiveStore(Selector.setGenerating);
  const addMolecule = useStore(Selector.addMolecule);
  const setChanged = usePrimitiveStore(Selector.setChanged);

  const [prompt, setPrompt] = useState<string>(generateMoleculePrompt);
  const [listening, setListening] = useState<boolean>(false);
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

  useEffect(() => {
    setPrompt(generateMoleculePrompt);
  }, [generateMoleculePrompt]);

  const generate = async () => {
    if (import.meta.env.PROD) {
      await generateRemotely();
    } else {
      await generateLocally();
    }
  };

  const generateRemotely = async () => {
    const functions = getFunctions(app, 'us-east4');
    // const callOpenAI = httpsCallable(functions, 'callOpenAI', { timeout: 300000 });
    const callAzure = httpsCallable(functions, 'callAzure', { timeout: 300000 });
    const res = (await callAzure({
      text: prompt,
    })) as any;
    resultRef.current = res.data.text;
  };

  const generateLocally = async () => {
    const apiKey = import.meta.env.VITE_AZURE_API_KEY;
    try {
      const response = await callAzureOpenAI(apiKey, prompt, true);
      resultRef.current = response.choices[0].message.content;
      console.log(response);
      console.log('set', response.choices[0].message.content);
    } catch (e) {
      console.log(e);
    }
  };

  const { error, interimResult, results, setResults, startSpeechToText, stopSpeechToText } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const speechToText = useMemo(() => {
    let s = '';
    for (const result of results) {
      s += (result as ResultType).transcript;
    }
    if (interimResult) s += interimResult;
    return s;
  }, [results]);

  useEffect(() => {
    if (speechToText !== '') setPrompt(speechToText);
  }, [speechToText]);

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
    setGenerating(true);
    setCommonStore((state) => {
      state.projectState.generateMoleculePrompt = prompt;
    });
    generate()
      .catch((e) => {
        setMessage('error', e.toString(), 30);
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
              setMessage('info', t('projectPanel.MoleculeAlreadyAdded', lang) + ': ' + mol.name, 30);
            }
          });
        } else {
          setMessage('error', t('message.FailInGeneratingMolecule', lang), 30);
        }
      })
      .finally(() => {
        setGenerating(false);
      });
    close();
  };

  const onCancel = () => {
    close();
  };

  const close = () => {
    setDialogVisible(false);
    setListening(false);
    stopSpeechToText();
  };

  const onClear = () => {
    setPrompt('');
    setResults([]);
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
          <img src={GenaiImage} width={'16px'} alt={'genai'} /> {t('projectPanel.GenerateMolecule', lang)}
        </div>
      }
      open={isDialogVisible()}
      footer={[
        <Button key="Cancel" onClick={onCancel}>
          {t('word.Cancel', lang)}
        </Button>,
        <Button key="Clear" onClick={onClear}>
          {t('word.Clear', lang)}
        </Button>,
        <Button key="OK" type="primary" onClick={onOk} disabled={prompt === ''}>
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
        <Space>
          {i18n.t('projectPanel.WhatMoleculeDoYouWant', lang)}
          {!error && (
            <>
              {listening ? (
                <>
                  <AudioMutedOutlined
                    style={{ paddingLeft: '2px' }}
                    onClick={() => {
                      setListening(false);
                      stopSpeechToText();
                    }}
                  />
                  <Audio width={12} height={16} />
                  {i18n.t('projectPanel.Listening', lang)}
                </>
              ) : (
                <AudioOutlined
                  style={{ paddingLeft: '2px' }}
                  onClick={() => {
                    setListening(true);
                    startSpeechToText().catch((e) => {
                      setMessage('error', e.toString());
                    });
                  }}
                />
              )}
            </>
          )}
        </Space>
        <TextArea
          disabled={listening}
          rows={10}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        <span style={{ fontSize: '12px' }}>
          <WarningOutlined /> {t('message.GeneratingAMoleculeMayTakeAWhile', lang)}
        </span>
      </Space>
    </Modal>
  );
});

export default GenerateMoleculeModal;
