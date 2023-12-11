/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { message } from 'antd';
import html2canvas from 'html2canvas';

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

export const copyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'absolute';
    textArea.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(textArea);
    const selection = document.getSelection();
    if (selection) {
        const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        if (selected) {
            selection.removeAllRanges();
            selection.addRange(selected);
        }
    }
};

export const saveImage = (fileName: string, imgUrl: string) => {
    let a = document.createElement('a') as HTMLAnchorElement;
    a.download = fileName;
    a.href = imgUrl;
    a.click();
};

export const screenshot = async (elementId: string, name: string, options: {}) => {
    const source = window.document.getElementById(elementId);
    if (source) {
        const canvas = await html2canvas(source, { ...options, removeContainer: true });
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png', 1.0);
        a.download = `${name}.png`;
        a.click();
    } else {
        throw new Error(`Cannot find element with ID ${elementId}`);
    }
};
