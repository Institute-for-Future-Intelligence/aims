/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useEffect, useRef } from 'react';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';

export const useLanguage = () => {
  return { lng: useStore(Selector.language) };
};

export const useMultipleKeys = (keydown?: (e: KeyboardEvent) => void, keyup?: (e: KeyboardEvent) => void) => {
  const pressedKeysRef = useRef<string[]>([]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (!pressedKeysRef.current.find((v) => v === e.code)) {
      pressedKeysRef.current.push(e.code);
    }
    if (keydown) {
      keydown(e);
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    const idx = pressedKeysRef.current.findIndex((v) => v === e.code);
    if (idx !== -1) {
      pressedKeysRef.current.splice(idx, 1);
    }
    if (keyup) {
      keyup(e);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return pressedKeysRef.current;
};
