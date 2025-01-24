/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useEffect, useRef } from 'react';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useRefStore } from './stores/commonRef';

export const useLanguage = () => {
  return { lng: useStore(Selector.language) };
};

export const useMultipleKeys = (keydown?: (e: KeyboardEvent) => void, keyup?: (e: KeyboardEvent) => void) => {
  const pressedKeysRef = useRef<string[]>([]);
  const dashboardCanvasRef = useRefStore((state) => state.dashboardCanvasRef);

  const onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
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
    if (dashboardCanvasRef?.current) {
      dashboardCanvasRef.current.addEventListener('keydown', onKeyDown);
      dashboardCanvasRef.current.addEventListener('keyup', onKeyUp);
      return () => {
        if (dashboardCanvasRef.current) {
          dashboardCanvasRef.current.removeEventListener('keydown', onKeyDown);
          dashboardCanvasRef.current.removeEventListener('keyup', onKeyUp);
        }
      };
    }
  }, [dashboardCanvasRef]);

  return pressedKeysRef.current;
};
