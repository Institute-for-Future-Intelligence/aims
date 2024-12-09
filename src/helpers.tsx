/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

// @ts-expect-error: Explain what?
import { saveSvgAsPng } from 'save-svg-as-png';
import { Button, message, Space } from 'antd';
import html2canvas from 'html2canvas';
import i18n from './i18n/i18n';
import { useStore } from './stores/common.ts';
import { UNDO_SHOW_INFO_DURATION } from './constants.ts';
import { usePrimitiveStore } from './stores/commonPrimitive.ts';

export const visitIFI = () => {
  window.open('https://intofuture.org', '_blank');
};

export const visitHomepage = () => {
  window.open('https://intofuture.org/aims.html', '_blank');
};

export const showSuccess = (msg: string, duration?: number) => {
  message.success({
    duration: duration ?? 2,
    content: msg,
    className: 'custom-class',
    style: {
      marginTop: '20vh',
    },
    onClick: () => {
      message.destroy();
    },
  });
};

export const showUndo = (msg: string, duration?: number) => {
  const lang = { lng: useStore.getState().language };
  // message.config({top: window.innerHeight - 60});
  message.info({
    duration: duration ?? 3,
    content: (
      <Space direction={'horizontal'}>
        <span>{msg}</span>
        <Button
          type={'primary'}
          title={i18n.t('menu.edit.Undo', lang)}
          onClick={() => {
            const commandName = useStore.getState().undoManager.undo();
            if (commandName) {
              setTimeout(() => {
                showInfo(i18n.t('menu.edit.Undone', lang), UNDO_SHOW_INFO_DURATION);
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
    onClose: () => {},
  });
};

export const showInfo = (msg: string, duration?: number) => {
  message.info({
    duration: duration ?? 2,
    content: msg,
    className: 'custom-class',
    style: {
      marginTop: '20vh',
    },
    onClick: () => {
      message.destroy();
    },
  });
};

export const showWarning = (msg: string, duration?: number) => {
  message.warning({
    duration: duration ?? 2,
    content: msg,
    className: 'custom-class',
    style: {
      marginTop: '20vh',
    },
    onClick: () => {
      message.destroy();
    },
  });
};

export const showError = (msg: string, duration?: number) => {
  message.error({
    duration: duration ?? 2,
    content: msg,
    className: 'custom-class',
    style: {
      marginTop: '20vh',
    },
    onClick: () => {
      message.destroy();
    },
  });
};

export const openInNewTab = (url: string) => {
  const win = window.open(url, '_blank');
  if (win) {
    win.focus();
  }
};

export const extractText = (html: string) => {
  return new DOMParser().parseFromString(html, 'text/html').documentElement.textContent;
};

export const containedInDOMRect = (rect: DOMRect, x: number, y: number, margin: number) => {
  return (
    x > rect.x - margin && x < rect.x + rect.width + margin && y > rect.y - margin && y < rect.y + rect.height + margin
  );
};

export const saveImage = (fileName: string, imgUrl: string) => {
  const a = document.createElement('a') as HTMLAnchorElement;
  a.download = fileName;
  a.href = imgUrl;
  a.click();
};

export const screenshot = async (elementId: string, name?: string) => {
  const source = window.document.getElementById(elementId);
  if (source) {
    const canvas = await html2canvas(source, { removeContainer: true });
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png', 1.0);
    a.download = `${name ?? elementId}.png`;
    a.click();
  } else {
    throw new Error(`Cannot find element with ID ${elementId}`);
  }
};

export const saveSvg = async (elementId: string, name?: string) => {
  const d = document.getElementById(elementId);
  if (d) {
    saveSvgAsPng(d, (name ?? elementId) + '.png');
  }
};
