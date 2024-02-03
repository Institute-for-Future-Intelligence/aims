/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import RotateZCW from '../assets/rotate-around-z-cw.png';
import RotateZCCW from '../assets/rotate-around-z-ccw.png';
import RotateYCW from '../assets/rotate-around-y-cw.png';
import RotateYCCW from '../assets/rotate-around-y-ccw.png';
import RotateXCW from '../assets/rotate-around-x-cw.png';
import RotateXCCW from '../assets/rotate-around-x-ccw.png';

import React, { useMemo, useState } from 'react';
import { FloatButton } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { usePrimitiveStore } from '../stores/commonPrimitive';
import { FlightControl } from '../constants.ts';
import { LabelMark } from '../components/menuItem.tsx';
import { startFlying, stopFlying } from '../keyboardListener.tsx';

const MoveMoleculeButtons = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const addUndoable = useStore(Selector.addUndoable);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const rotationStep = useStore(Selector.rotationStep) ?? 0.1;
  const translationStep = useStore(Selector.translationStep) ?? 1.0;

  const [selector, setSelector] = useState<string | undefined>();

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <FloatButton.Group
      shape="square"
      style={{
        position: 'absolute',
        bottom: '8px',
        left: '6px',
        userSelect: 'none',
      }}
    >
      <FloatButton
        tooltip={
          <>
            {t('experiment.RotateAroundZClockwise', lang)}
            <LabelMark>(Q {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate z cw'} src={RotateZCW} />}
        onMouseDown={() => startFlying(FlightControl.YawLeft)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        tooltip={
          <>
            {t('experiment.RotateAroundZCounterclockwise', lang)}
            <LabelMark>(E {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate z ccw'} src={RotateZCCW} />}
        onMouseDown={() => startFlying(FlightControl.YawRight)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        tooltip={
          <>
            {t('experiment.RotateAroundYClockwise', lang)}
            <LabelMark>(W {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate y cw'} src={RotateYCW} />}
        onMouseDown={() => startFlying(FlightControl.PitchDown)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        tooltip={
          <>
            {t('experiment.RotateAroundYCounterclockwise', lang)}
            <LabelMark>(S {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate y ccw'} src={RotateYCCW} />}
        onMouseDown={() => startFlying(FlightControl.PitchUp)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        tooltip={
          <>
            {t('experiment.RotateAroundXClockwise', lang)}
            <LabelMark>(D {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate x cw'} src={RotateXCW} />}
        onMouseDown={() => startFlying(FlightControl.RollRight)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        tooltip={
          <>
            {t('experiment.RotateAroundXCounterclockwise', lang)}
            <LabelMark>(A {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate x ccw'} src={RotateXCCW} />}
        onMouseDown={() => startFlying(FlightControl.RollLeft)}
        onMouseUp={() => stopFlying()}
      />
    </FloatButton.Group>
  );
});

export default MoveMoleculeButtons;
