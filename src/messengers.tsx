/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { App, Button, Space } from 'antd';
import i18n from './i18n/i18n';
import { useStore } from './stores/common.ts';
import { UNDO_SHOW_INFO_DURATION } from './constants.ts';
import { usePrimitiveStore } from './stores/commonPrimitive.ts';
import React, { useEffect } from 'react';
import * as Selector from './stores/selector';
import { setMessage } from './helpers.tsx';

const Messenger = React.memo(() => {
  const msg = usePrimitiveStore(Selector.message);
  const lang = { lng: useStore(Selector.language) };
  const { message } = App.useApp();

  useEffect(() => {
    if (msg?.type === 'success') {
      message.success({
        duration: msg?.duration ?? 2,
        content: msg?.content ?? 'Unknown',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
        onClick: () => {
          message.destroy();
        },
      });
    } else if (msg?.type === 'warning') {
      message.warning({
        duration: msg?.duration ?? 2,
        content: msg?.content ?? 'Unknown',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
        onClick: () => {
          message.destroy();
        },
      });
    } else if (msg?.type === 'info') {
      message.info({
        duration: msg?.duration ?? 2,
        content: msg?.content ?? 'Unknown',
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
        onClick: () => {
          message.destroy();
        },
      });
    } else if (msg?.type === 'error') {
      message.error({
        duration: msg.duration ?? 2,
        content: msg.content,
        className: 'custom-class',
        style: {
          marginTop: '20vh',
        },
        onClick: () => {
          message.destroy();
        },
      });
    } else if (msg?.type === 'undo') {
      // message.config({top: window.innerHeight - 60});
      message.info({
        duration: msg?.duration ?? 3,
        content: (
          <Space direction={'horizontal'}>
            <span>{msg?.content ?? 'Unknown'}</span>
            <Button
              type={'primary'}
              title={i18n.t('menu.edit.Undo', lang)}
              onClick={() => {
                const commandName = useStore.getState().undoManager.undo();
                if (commandName) {
                  setTimeout(() => {
                    setMessage('info', i18n.t('menu.edit.Undone', lang), UNDO_SHOW_INFO_DURATION);
                  }, 500);
                }
                if (useStore.getState().loggable) {
                  useStore.getState().logAction('Undo');
                }
                message.destroy();
              }}
            >
              {i18n.t('menu.edit.Undo', lang)}
            </Button>
            <Button
              type={'primary'}
              title={i18n.t('message.DoNotShowAgain', lang)}
              onClick={() => {
                usePrimitiveStore.getState().set((state) => {
                  state.muteUndoMessage = true;
                });
                message.destroy();
              }}
            >
              {i18n.t('word.Mute', lang)}
            </Button>
          </Space>
        ),
        style: {
          // other styles do not seem to work
          color: 'black',
        },
        onClick: () => {
          message.destroy();
        },
      });
    }
  }, [msg]);

  return <></>;
});

export default Messenger;
