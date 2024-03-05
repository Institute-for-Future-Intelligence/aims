/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import RotateZCW from '../assets/rotate-around-z-cw.png';
import RotateZCCW from '../assets/rotate-around-z-ccw.png';
import RotateYCW from '../assets/rotate-around-y-cw.png';
import RotateYCCW from '../assets/rotate-around-y-ccw.png';
import RotateXCW from '../assets/rotate-around-x-cw.png';
import RotateXCCW from '../assets/rotate-around-x-ccw.png';
import TranslateXPos from '../assets/translate-in-x-positive.png';
import TranslateXNeg from '../assets/translate-in-x-negative.png';
import TranslateYPos from '../assets/translate-in-y-positive.png';
import TranslateYNeg from '../assets/translate-in-y-negative.png';
import TranslateZPos from '../assets/translate-in-z-positive.png';
import TranslateZNeg from '../assets/translate-in-z-negative.png';

import React, { useMemo } from 'react';
import { FloatButton } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { FlightControl } from '../constants.ts';
import { LabelMark } from '../components/menuItem.tsx';
import { stopFlying } from '../fly.ts';
import { startFlying } from '../fly.ts';

const DockingButtons = React.memo(() => {
  const language = useStore(Selector.language);
  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <FloatButton.Group
      shape="square"
      style={{
        position: 'absolute',
        top: '56px',
        left: '6px',
        userSelect: 'none',
        zIndex: 13,
      }}
    >
      {/* translation buttons */}
      <FloatButton
        shape="square"
        tooltip={
          <>
            {t('experiment.MoveInPositiveXDirection', lang)}
            <LabelMark>(X {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'translate in x positive'} src={TranslateXPos} />}
        onMouseDown={() => startFlying(FlightControl.TranslateInPositiveX)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        style={{ borderRadius: 0 }}
        tooltip={
          <>
            {t('experiment.MoveInNegativeXDirection', lang)}
            <LabelMark>(Shift+X {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'translate in x negative'} src={TranslateXNeg} />}
        onMouseDown={() => startFlying(FlightControl.TranslateInNegativeX)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        tooltip={
          <>
            {t('experiment.MoveInPositiveYDirection', lang)}
            <LabelMark>(Y {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'translate in y positive'} src={TranslateYPos} />}
        onMouseDown={() => startFlying(FlightControl.TranslateInPositiveY)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        tooltip={
          <>
            {t('experiment.MoveInNegativeYDirection', lang)}
            <LabelMark>(Shift+Y {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'translate in y negative'} src={TranslateYNeg} />}
        onMouseDown={() => startFlying(FlightControl.TranslateInNegativeY)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        style={{ borderRadius: 0 }}
        tooltip={
          <>
            {t('experiment.MoveInPositiveZDirection', lang)}
            <LabelMark>(Z {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'translate in z positive'} src={TranslateZPos} />}
        onMouseDown={() => startFlying(FlightControl.TranslateInPositiveZ)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        tooltip={
          <>
            {t('experiment.MoveInNegativeZDirection', lang)}
            <LabelMark>(Shift+Z {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'translate in z negative'} src={TranslateZNeg} />}
        onMouseDown={() => startFlying(FlightControl.TranslateInNegativeZ)}
        onMouseUp={() => stopFlying()}
      />

      {/* rotation buttons */}
      <FloatButton
        shape="square"
        tooltip={
          <>
            {t('experiment.RotateAroundXClockwise', lang)}
            <LabelMark>(D {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate x cw'} src={RotateXCW} />}
        onMouseDown={() => startFlying(FlightControl.RotateAroundXClockwise)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        style={{ borderRadius: 0 }}
        tooltip={
          <>
            {t('experiment.RotateAroundXCounterclockwise', lang)}
            <LabelMark>(A {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate x ccw'} src={RotateXCCW} />}
        onMouseDown={() => startFlying(FlightControl.RotateAroundXCounterclockwise)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        tooltip={
          <>
            {t('experiment.RotateAroundYClockwise', lang)}
            <LabelMark>(W {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate y cw'} src={RotateYCW} />}
        onMouseDown={() => startFlying(FlightControl.RotateAroundYClockwise)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        tooltip={
          <>
            {t('experiment.RotateAroundYCounterclockwise', lang)}
            <LabelMark>(S {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate y ccw'} src={RotateYCCW} />}
        onMouseDown={() => startFlying(FlightControl.RotateAroundYCounterclockwise)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        style={{ borderRadius: 0 }}
        tooltip={
          <>
            {t('experiment.RotateAroundZClockwise', lang)}
            <LabelMark>(Q {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate z cw'} src={RotateZCW} />}
        onMouseDown={() => startFlying(FlightControl.RotateAroundZClockwise)}
        onMouseUp={() => stopFlying()}
      />
      <FloatButton
        shape="square"
        tooltip={
          <>
            {t('experiment.RotateAroundZCounterclockwise', lang)}
            <LabelMark>(E {t('word.KeyboardKey', lang)})</LabelMark>
          </>
        }
        icon={<img width="20px" alt={'rotate z ccw'} src={RotateZCCW} />}
        onMouseDown={() => startFlying(FlightControl.RotateAroundZCounterclockwise)}
        onMouseUp={() => stopFlying()}
      />
    </FloatButton.Group>
  );
});

export default DockingButtons;
