/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

// @ts-expect-error: Explain what?
import { saveSvgAsPng } from 'save-svg-as-png';
import html2canvas from 'html2canvas';
import { usePrimitiveStore } from './stores/commonPrimitive.ts';
import { Message } from './types.ts';

export const visitIFI = () => {
  window.open('https://intofuture.org', '_blank');
};

export const visitHomepage = () => {
  window.open('https://intofuture.org/aims.html', '_blank');
};

export const setMessage = (type: string, content: string, duration?: number) => {
  usePrimitiveStore.getState().set((state) => {
    state.message = { type, content, duration } as Message;
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
