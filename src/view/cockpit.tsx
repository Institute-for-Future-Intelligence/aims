/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CaretUpOutlined, CaretDownOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import SteeringWheel from '../assets/steering-wheel.png';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useRefStore } from '../stores/commonRef.ts';
import { useTranslation } from 'react-i18next';
import { InputNumber, Slider } from 'antd';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';

const Cockpit = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const chamberViewerPercentWidth = useStore(Selector.chamberViewerPercentWidth);
  const hideGallery = useStore(Selector.hideGallery);
  const language = useStore(Selector.language);
  const navPosition = useStore(Selector.navPosition);
  const spaceshipThrust = useStore(Selector.spaceshipThrust);
  const navCoordinates = usePrimitiveStore(Selector.navCoordinates);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const upperCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lowerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftBarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightBarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const wheelRef = useRef<HTMLImageElement | null>(null);
  const pitchUpRef = useRef<HTMLElement | null>(null);
  const pitchDownRef = useRef<HTMLElement | null>(null);
  const yawLeftRef = useRef<HTMLElement | null>(null);
  const yawRightRef = useRef<HTMLElement | null>(null);
  const rollLeftRef = useRef<HTMLElement | null>(null);
  const rollRightRef = useRef<HTMLElement | null>(null);
  const moveForwardRef = useRef<HTMLElement | null>(null);
  const moveBackwardRef = useRef<HTMLElement | null>(null);
  const moveLeftRef = useRef<HTMLElement | null>(null);
  const moveRightRef = useRef<HTMLElement | null>(null);
  const moveUpRef = useRef<HTMLElement | null>(null);
  const moveDownRef = useRef<HTMLElement | null>(null);
  const thrustSliderRef = useRef<HTMLElement | null>(null);
  const xCoordinateFieldRef = useRef<HTMLElement | null>(null);
  const yCoordinateFieldRef = useRef<HTMLElement | null>(null);
  const zCoordinateFieldRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    usePrimitiveStore.getState().set((state) => {
      state.navCoordinates = [...navPosition];
    });
  }, [navPosition]);

  const [initialWidth, setInitialWidth] = useState<number | null>(null);
  const [initialHeight, setInitialHeight] = useState<number | null>(null);
  const upperHeight = 80;
  const lowerHeight = 100;
  const wheelRadius = 24;
  const barWidth = 4;

  const drawUpperPart = useCallback((width: number) => {
    if (!upperCanvasRef.current) return;
    const ctx = upperCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    /** get actually size based on 0-100 value */
    const getW = (w: number) => (w / 100) * width;
    ctx.clearRect(0, 0, width, upperHeight);

    ctx.beginPath();
    ctx.moveTo(getW(5), 0);
    ctx.lineTo(getW(20), upperHeight);
    ctx.lineTo(getW(80), upperHeight);
    ctx.lineTo(getW(95), 0);
    ctx.lineTo(getW(80), 0);
    ctx.lineTo(getW(75), 55);
    ctx.lineTo(getW(25), 55);
    ctx.lineTo(getW(20), 0);
    ctx.closePath();
    ctx.fillStyle = '#1A86A0'; // background color
    ctx.fill();

    // window
    ctx.beginPath();
    ctx.moveTo(getW(20), 0);
    ctx.lineTo(getW(25), 55);
    ctx.lineTo(getW(75), 55);
    ctx.lineTo(getW(80), 0);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#0F6E81';
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = 'rgb(40 183 217 / 40%)';
    ctx.fill();

    // reflections
    ctx.beginPath();
    ctx.moveTo(getW(25), 55);
    ctx.lineTo(getW(30), 55);
    ctx.lineTo(getW(40), 0);
    ctx.lineTo(getW(35), 0);
    ctx.closePath();
    ctx.moveTo(getW(32), 55);
    ctx.lineTo(getW(35), 55);
    ctx.lineTo(getW(45), 0);
    ctx.lineTo(getW(42), 0);
    ctx.closePath();
    ctx.moveTo(getW(37), 55);
    ctx.lineTo(getW(38), 55);
    ctx.lineTo(getW(48), 0);
    ctx.lineTo(getW(47), 0);
    ctx.closePath();
    ctx.moveTo(getW(42), 55);
    ctx.lineTo(getW(46), 55);
    ctx.lineTo(getW(56), 0);
    ctx.lineTo(getW(52), 0);
    ctx.closePath();
    ctx.moveTo(getW(57), 55);
    ctx.lineTo(getW(59), 55);
    ctx.lineTo(getW(69), 0);
    ctx.lineTo(getW(67), 0);
    ctx.closePath();
    ctx.moveTo(getW(62), 55);
    ctx.lineTo(getW(66), 55);
    ctx.lineTo(getW(76), 0);
    ctx.lineTo(getW(72), 0);
    ctx.closePath();
    ctx.lineWidth = 0.1;
    ctx.fillStyle = 'rgb(125 206 226 / 40%)';
    ctx.fill();

    // strips
    ctx.beginPath();
    ctx.moveTo(getW(9), 10);
    ctx.lineTo(getW(20), 10);
    ctx.moveTo(getW(11), 20);
    ctx.lineTo(getW(21), 20);
    ctx.moveTo(getW(12), 30);
    ctx.lineTo(getW(22), 30);
    ctx.moveTo(getW(14), 40);
    ctx.lineTo(getW(23), 40);
    ctx.moveTo(getW(16), 50);
    ctx.lineTo(getW(24), 50);
    ctx.moveTo(getW(18), 60);
    ctx.lineTo(getW(25), 60);
    ctx.moveTo(getW(20), 70);
    ctx.lineTo(getW(26), 70);
    ctx.moveTo(getW(80), 10);
    ctx.lineTo(getW(91), 10);
    ctx.moveTo(getW(79), 20);
    ctx.lineTo(getW(89), 20);
    ctx.moveTo(getW(78), 30);
    ctx.lineTo(getW(87), 30);
    ctx.moveTo(getW(77), 40);
    ctx.lineTo(getW(85), 40);
    ctx.moveTo(getW(76), 50);
    ctx.lineTo(getW(83), 50);
    ctx.moveTo(getW(75), 60);
    ctx.lineTo(getW(81), 60);
    ctx.moveTo(getW(74), 70);
    ctx.lineTo(getW(79), 70);
    ctx.strokeStyle = '#2AB6D3';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(getW(35), 70);
    ctx.lineTo(getW(40), 70);
    ctx.moveTo(getW(60), 70);
    ctx.lineTo(getW(65), 70);
    ctx.strokeStyle = '#71ABB9';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#D1D483';
    ctx.fillRect(getW(30), 66, 8, 8);
    ctx.fillRect(getW(32), 66, 8, 8);

    ctx.fillStyle = '#65584B';
    ctx.fillRect(getW(42), 66, 8, 8);
    ctx.fillRect(getW(44), 66, 8, 8);
    ctx.fillRect(getW(46), 66, 8, 8);
    ctx.fillRect(getW(48), 66, 8, 8);
    ctx.fillRect(getW(50), 66, 8, 8);
    ctx.fillRect(getW(52), 66, 8, 8);
    ctx.fillRect(getW(54), 66, 8, 8);
    ctx.fillRect(getW(56), 66, 8, 8);

    ctx.fillStyle = '#D1D483';
    ctx.fillRect(getW(68), 66, 8, 8);
    ctx.fillRect(getW(70), 66, 8, 8);
  }, []);

  const drawBars = useCallback((width: number, height: number) => {
    if (leftBarCanvasRef.current) {
      const ctx = leftBarCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, height);
      ctx.moveTo(2, 0);
      ctx.lineTo(2, height);
      ctx.lineWidth = barWidth;
      ctx.strokeStyle = '#1A86A0';
      ctx.stroke();
    }
    if (rightBarCanvasRef.current) {
      const ctx = rightBarCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, height);
      ctx.moveTo(2, 0);
      ctx.lineTo(2, height);
      ctx.lineWidth = barWidth;
      ctx.strokeStyle = '#1A86A0';
      ctx.stroke();
    }
  }, []);

  const drawLowerPart = useCallback((width: number) => {
    if (!lowerCanvasRef.current) return;
    const ctx = lowerCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    /** get actually size based on 0-100 value */
    const getW = (w: number) => (w / 100) * width;

    ctx.clearRect(0, 0, width, lowerHeight);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;

    // center background
    ctx.beginPath();
    ctx.moveTo(getW(20), 0);
    ctx.lineTo(getW(80), 0);
    ctx.lineTo(getW(90), lowerHeight);
    ctx.lineTo(getW(10), lowerHeight);
    ctx.closePath();
    ctx.fillStyle = '#1A86A0'; // background color
    ctx.fill();

    // left background
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(getW(20), 0);
    ctx.lineTo(getW(10), lowerHeight);
    ctx.lineTo(getW(7.5), lowerHeight);
    ctx.lineTo(getW(15), 31);
    ctx.lineTo(getW(2), 70);
    ctx.lineTo(getW(2), lowerHeight);
    ctx.lineTo(0, lowerHeight);
    ctx.closePath();
    ctx.fillStyle = '#135261';
    ctx.fill();

    // right background
    ctx.beginPath();
    ctx.moveTo(getW(80), 0);
    ctx.lineTo(width, 60);
    ctx.lineTo(width, lowerHeight);
    ctx.lineTo(getW(98), lowerHeight);
    ctx.lineTo(getW(98), 70);
    ctx.lineTo(getW(85), 31);
    ctx.lineTo(getW(92.5), lowerHeight);
    ctx.lineTo(getW(90), lowerHeight);
    ctx.closePath();
    ctx.fill();

    // left window
    ctx.beginPath();
    ctx.moveTo(getW(2), lowerHeight);
    ctx.lineTo(getW(2), 70);
    ctx.lineTo(getW(15), 31);
    ctx.lineTo(getW(7.5), lowerHeight);
    ctx.closePath();

    // right window
    ctx.moveTo(getW(98), 70);
    ctx.lineTo(getW(85), 31);
    ctx.lineTo(getW(92.5), lowerHeight);
    ctx.lineTo(getW(98), lowerHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgb(40 183 217 / 30%)';
    ctx.fill();
  }, []);

  const getWidth = useCallback(() => {
    const rightChild = document.getElementById('split-pane-right-child');
    if (rightChild) {
      return rightChild.clientWidth;
    } else {
      return 1000;
    }
  }, []);

  const getHeight = useCallback(() => {
    const rightChild = document.getElementById('split-pane-right-child');
    if (rightChild) {
      return rightChild.clientHeight - upperHeight - lowerHeight;
    } else {
      return 800;
    }
  }, []);

  const onResize = useCallback(() => {
    if (lowerCanvasRef.current && upperCanvasRef.current && leftBarCanvasRef.current && rightBarCanvasRef.current) {
      const width = getWidth();
      const height = getHeight();
      lowerCanvasRef.current.width = width;
      upperCanvasRef.current.width = width;
      leftBarCanvasRef.current.height = height;
      leftBarCanvasRef.current.style.right = 0.8 * width - barWidth + 'px';
      rightBarCanvasRef.current.height = height;
      rightBarCanvasRef.current.style.right = 0.2 * width + 'px';
      drawLowerPart(width);
      drawUpperPart(width);
      drawBars(width, height);
      if (wheelRef.current) {
        wheelRef.current.style.right = width / 2 - wheelRadius + 'px';
      }
      if (pitchUpRef.current) {
        pitchUpRef.current.style.right = width / 2 - 10 + 'px';
      }
      if (pitchDownRef.current) {
        pitchDownRef.current.style.right = width / 2 - 10 + 'px';
      }
      if (yawLeftRef.current) {
        yawLeftRef.current.style.right = width / 2 - 2 + wheelRadius + 'px';
      }
      if (yawRightRef.current) {
        yawRightRef.current.style.right = width / 2 - 19 - wheelRadius + 'px';
      }
      if (rollLeftRef.current) {
        rollLeftRef.current.style.right = width / 2 + 21 + wheelRadius + 'px';
      }
      if (rollRightRef.current) {
        rollRightRef.current.style.right = width / 2 - 42 - wheelRadius + 'px';
      }
      if (moveForwardRef.current) {
        moveForwardRef.current.style.right = width / 2 + 250 + 'px';
      }
      if (moveBackwardRef.current) {
        moveBackwardRef.current.style.right = width / 2 + 215 + 'px';
      }
      if (moveLeftRef.current) {
        moveLeftRef.current.style.right = width / 2 + 180 + 'px';
      }
      if (moveRightRef.current) {
        moveRightRef.current.style.right = width / 2 + 145 + 'px';
      }
      if (moveUpRef.current) {
        moveUpRef.current.style.right = width / 2 + 110 + 'px';
      }
      if (moveDownRef.current) {
        moveDownRef.current.style.right = width / 2 + 75 + 'px';
      }
      if (thrustSliderRef.current) {
        thrustSliderRef.current.style.right = width / 2 - 150 + 'px';
      }
      if (xCoordinateFieldRef.current) {
        xCoordinateFieldRef.current.style.right = width / 2 - 210 + 'px';
      }
      if (yCoordinateFieldRef.current) {
        yCoordinateFieldRef.current.style.right = width / 2 - 268 + 'px';
      }
      if (zCoordinateFieldRef.current) {
        zCoordinateFieldRef.current.style.right = width / 2 - 326 + 'px';
      }
    }
  }, [drawLowerPart]);

  // init width and height
  useEffect(() => {
    setInitialWidth(getWidth());
    setInitialHeight(getHeight());
  }, [getWidth, setInitialWidth, getHeight, setInitialHeight]);

  // init draw
  useEffect(() => {
    if (initialWidth === null) return;
    drawLowerPart(initialWidth);
    drawUpperPart(initialWidth);
    if (initialHeight === null) return;
    drawBars(initialWidth, initialHeight);
  }, [initialWidth, initialHeight, drawLowerPart, drawUpperPart, drawBars]);

  // listen to split pane resize
  useEffect(() => {
    onResize();
  }, [hideGallery, chamberViewerPercentWidth, onResize]);

  // add window resize event listener
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // =====
  const [pressedKeyState, setPressKeyState] = useState<string[]>([]);
  const pressedKeysRef = useRef<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!pressedKeysRef.current.find((v) => v === e.code)) {
      pressedKeysRef.current.push(e.code);
      setPressKeyState([...pressedKeysRef.current]);
      updateSteeringWheel(pressedKeysRef.current);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const idx = pressedKeysRef.current.findIndex((v) => v === e.code);
    if (idx !== -1) {
      pressedKeysRef.current.splice(idx, 1);
      setPressKeyState([...pressedKeysRef.current]);
      updateSteeringWheel(pressedKeysRef.current);
    }
  };

  const handleKeyClickDown = (key: string) => {
    if (!pressedKeysRef.current.find((v) => v === key)) {
      pressedKeysRef.current.push(key);
      setPressKeyState([...pressedKeysRef.current]);
      updateSteeringWheel(pressedKeysRef.current);
    }
  };

  const handleKeyClickUp = (key: string) => {
    const idx = pressedKeysRef.current.findIndex((v) => v === key);
    if (idx !== -1) {
      pressedKeysRef.current.splice(idx, 1);
      setPressKeyState([...pressedKeysRef.current]);
      updateSteeringWheel(pressedKeysRef.current);
    }
  };

  const updateSteeringWheel = (keys: string[]) => {
    if (!wheelRef.current) return;
    let x = 0,
      y = 0;
    for (const key of keys) {
      if (key === 'ArrowLeft') x--;
      else if (key === 'ArrowRight') x++;
      if (key === 'ArrowUp') y++;
      else if (key === 'ArrowDown') y--;
    }
    if (x === -1) {
      wheelRef.current.style.transform = 'rotate(-60deg) translateY(0)';
    } else if (x === 1) {
      wheelRef.current.style.transform = 'rotate(60deg) translateY(0)';
    } else if (x === 0) {
      wheelRef.current.style.transform = 'rotate(0deg)';
      if (y === -1) {
        wheelRef.current.style.transform = 'translateY(20px) perspective(100px) rotateX(-45deg) rotate(0deg)';
      } else if (y === 1) {
        wheelRef.current.style.transform = 'translateY(-20px) perspective(100px) rotateX(45deg) rotate(0deg)';
      } else {
        wheelRef.current.style.transform = 'rotate(0) translateY(0)';
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (initialWidth === null || initialHeight === null) return null;

  return (
    <>
      {/* upper part */}
      <canvas
        ref={upperCanvasRef}
        width={initialWidth}
        height={upperHeight}
        style={{
          position: 'absolute',
          top: '72px',
          right: '0',
          pointerEvents: 'none',
        }}
      />

      {/*left bar*/}
      <canvas
        ref={leftBarCanvasRef}
        width={barWidth}
        height={initialHeight}
        style={{
          position: 'absolute',
          top: '152px',
          right: 0.8 * initialWidth - barWidth + 'px',
          pointerEvents: 'none',
        }}
      />

      {/*right bar*/}
      <canvas
        ref={rightBarCanvasRef}
        width={barWidth}
        height={initialHeight}
        style={{
          position: 'absolute',
          top: '152px',
          right: 0.2 * initialWidth + 'px',
          pointerEvents: 'none',
        }}
      />

      {/* lower part */}
      <canvas
        ref={lowerCanvasRef}
        width={initialWidth}
        height={lowerHeight}
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          // pointerEvents: 'none',
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      />

      {/* steering wheel */}
      <img
        alt={'wheel'}
        ref={wheelRef}
        src={SteeringWheel}
        style={{
          position: 'absolute',
          bottom: '26px',
          right: initialWidth / 2 - wheelRadius,
          height: wheelRadius * 2 + 'px',
          width: wheelRadius * 2 + 'px',
          transition: 'transform 0.3s ease',
          userSelect: 'none',
        }}
      />

      {/*pitch up */}
      <CaretUpOutlined
        ref={pitchUpRef}
        title={t('spaceship.PitchUpPressArrowUp', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'ArrowUp') ? '#f0de1a' : '#e0b289',
          padding: '2px',
          color: 'antiquewhite',
          bottom: '72px',
          right: initialWidth / 2 - 10,
          height: '20px',
          width: '20px',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.spinUp(controls.turnSpeed);
            controls.update(true);
          }
          handleKeyClickDown('ArrowUp');
        }}
        onPointerUp={() => handleKeyClickUp('ArrowUp')}
      />

      {/*pitch down*/}
      <CaretDownOutlined
        ref={pitchDownRef}
        title={t('spaceship.PitchDownPressArrowDown', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'ArrowDown') ? '#f0de1a' : '#e0b289',
          padding: '2px',
          color: 'antiquewhite',
          bottom: '6px',
          right: initialWidth / 2 - 9,
          height: '20px',
          width: '20px',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.spinUp(-controls.turnSpeed);
            controls.update(true);
          }
          handleKeyClickDown('ArrowDown');
        }}
        onPointerUp={() => handleKeyClickUp('ArrowDown')}
      />

      {/*yaw left*/}
      <CaretLeftOutlined
        ref={yawLeftRef}
        title={t('spaceship.YawLeftPressArrowLeft', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'ArrowLeft') ? '#f0de1a' : '#e0b289',
          padding: '2px',
          color: 'antiquewhite',
          bottom: '40px',
          right: initialWidth / 2 - 2 + wheelRadius,
          height: '20px',
          width: '20px',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.spinRight(-controls.turnSpeed);
            controls.update(true);
          }
          handleKeyClickDown('ArrowLeft');
        }}
        onPointerUp={() => handleKeyClickUp('ArrowLeft')}
      />

      {/*yaw right*/}
      <CaretRightOutlined
        ref={yawRightRef}
        title={t('spaceship.YawRightPressArrowRight', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'ArrowRight') ? '#f0de1a' : '#e0b289',
          padding: '2px',
          color: 'antiquewhite',
          bottom: '40px',
          right: initialWidth / 2 - 19 - wheelRadius,
          height: '20px',
          width: '20px',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.spinRight(controls.turnSpeed);
            controls.update(true);
          }
          handleKeyClickDown('ArrowRight');
        }}
        onPointerUp={() => handleKeyClickUp('ArrowRight')}
      />

      {/*roll left*/}
      <span
        ref={rollLeftRef}
        title={t('spaceship.RollLeftPressQ', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'KeyQ') ? '#f0de1a' : '#e0b289',
          bottom: '40px',
          right: initialWidth / 2 + 21 + wheelRadius,
          width: '20px',
          height: '20px',
          userSelect: 'none',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.rollRight(controls.turnSpeed);
            controls.update(true);
          }
          handleKeyClickDown('KeyQ');
        }}
        onPointerUp={() => handleKeyClickUp('KeyQ')}
      >
        <span
          style={{
            position: 'absolute',
            fontSize: '20px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '2px',
            right: '0px',
            width: '20px',
            height: '20px',
            fontWeight: 'bold',
            userSelect: 'none',
          }}
        >
          ↶
        </span>
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '-35px',
            right: '-6px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          Q
        </span>
      </span>

      {/*roll right*/}
      <span
        ref={rollRightRef}
        title={t('spaceship.RollRightPressE', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'KeyE') ? '#f0de1a' : '#e0b289',
          bottom: '40px',
          right: initialWidth / 2 - 42 - wheelRadius,
          width: '20px',
          height: '20px',
          userSelect: 'none',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.rollRight(-controls.turnSpeed);
            controls.update(true);
          }
          handleKeyClickDown('KeyE');
        }}
        onPointerUp={() => handleKeyClickUp('KeyE')}
      >
        <span
          style={{
            position: 'absolute',
            fontSize: '20px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '2px',
            right: '0px',
            width: '20px',
            height: '20px',
            fontWeight: 'bold',
            userSelect: 'none',
          }}
        >
          ↷
        </span>
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '-35px',
            right: '-6px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          E
        </span>
      </span>

      {/*move forward*/}
      <span
        ref={moveForwardRef}
        title={t('spaceship.MoveForwardPressW', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'KeyW') ? '#f0de1a' : '#e0b289',
          bottom: lowerHeight / 2 - 14,
          right: initialWidth / 2 + 250,
          width: '30px',
          height: '30px',
          userSelect: 'none',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.moveForward(controls.moveSpeed);
            controls.update(true);
          }
          handleKeyClickDown('KeyW');
        }}
        onPointerUp={() => handleKeyClickUp('KeyW')}
      >
        <span
          style={{
            position: 'absolute',
            fontSize: '25px',
            fontWeight: 'bolder',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '0px',
            right: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          △
        </span>
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '-32px',
            right: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          W
        </span>
      </span>

      {/*move backward*/}
      <span
        ref={moveBackwardRef}
        title={t('spaceship.MoveBackwardPressS', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'KeyS') ? '#f0de1a' : '#e0b289',
          bottom: lowerHeight / 2 - 14,
          right: initialWidth / 2 + 215,
          width: '30px',
          height: '30px',
          userSelect: 'none',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.moveForward(-controls.moveSpeed);
            controls.update(true);
          }
          handleKeyClickDown('KeyS');
        }}
        onPointerUp={() => handleKeyClickUp('KeyS')}
      >
        <span
          style={{
            position: 'absolute',
            fontSize: '25px',
            fontWeight: 'bolder',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '0px',
            left: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          ▽
        </span>
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '-32px',
            right: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          S
        </span>
      </span>

      {/*move left*/}
      <span
        ref={moveLeftRef}
        title={t('spaceship.MoveLeftPressA', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'KeyA') ? '#f0de1a' : '#e0b289',
          bottom: lowerHeight / 2 - 14,
          right: initialWidth / 2 + 180,
          width: '30px',
          height: '30px',
          userSelect: 'none',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.moveRight(-controls.moveSpeed);
            controls.update(true);
          }
          handleKeyClickDown('KeyA');
        }}
        onPointerUp={() => handleKeyClickUp('KeyA')}
      >
        <span
          style={{
            position: 'absolute',
            fontSize: '25px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '0px',
            left: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          🡰
        </span>
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '-32px',
            right: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          A
        </span>
      </span>

      {/*move right*/}
      <span
        ref={moveRightRef}
        title={t('spaceship.MoveRightPressD', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'KeyD') ? '#f0de1a' : '#e0b289',
          bottom: lowerHeight / 2 - 14,
          right: initialWidth / 2 + 145,
          width: '30px',
          height: '30px',
          userSelect: 'none',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.moveRight(controls.moveSpeed);
            controls.update(true);
          }
          handleKeyClickDown('KeyD');
        }}
        onPointerUp={() => handleKeyClickUp('KeyD')}
      >
        <span
          style={{
            position: 'absolute',
            fontSize: '25px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '0px',
            left: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          🡲
        </span>
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '-32px',
            right: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          D
        </span>
      </span>

      {/*move up*/}
      <span
        ref={moveUpRef}
        title={t('spaceship.MoveUpPressZ', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'KeyZ') ? '#f0de1a' : '#e0b289',
          bottom: lowerHeight / 2 - 14,
          right: initialWidth / 2 + 110,
          width: '30px',
          height: '30px',
          userSelect: 'none',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.moveUp(controls.moveSpeed);
            controls.update(true);
          }
          handleKeyClickDown('KeyZ');
        }}
        onPointerUp={() => handleKeyClickUp('KeyZ')}
      >
        <span
          style={{
            position: 'absolute',
            fontSize: '25px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '2px',
            left: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          🡱
        </span>
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '-32px',
            right: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          Z
        </span>
      </span>

      {/*move down*/}
      <span
        ref={moveDownRef}
        title={t('spaceship.MoveDownPressX', lang)}
        style={{
          position: 'absolute',
          backgroundColor: pressedKeyState.find((key) => key === 'KeyX') ? '#f0de1a' : '#e0b289',
          bottom: lowerHeight / 2 - 14,
          right: initialWidth / 2 + 75,
          width: '30px',
          height: '30px',
          userSelect: 'none',
        }}
        onPointerDown={() => {
          const controls = useRefStore.getState().controlsRef?.current;
          if (controls) {
            controls.moveUp(-controls.moveSpeed);
            controls.update(true);
          }
          handleKeyClickDown('KeyX');
        }}
        onPointerUp={() => handleKeyClickUp('KeyX')}
      >
        <span
          style={{
            position: 'absolute',
            fontSize: '25px',
            padding: '0px',
            color: 'antiquewhite',
            top: '2px',
            left: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          🡳
        </span>
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            padding: '0px',
            color: 'antiquewhite',
            bottom: '-32px',
            right: '0px',
            width: '30px',
            height: '30px',
            userSelect: 'none',
          }}
        >
          X
        </span>
      </span>

      {/*thrust slider*/}
      <span
        ref={thrustSliderRef}
        title={t('spaceship.ChangeThrustPower', lang)}
        style={{
          position: 'absolute',
          backgroundColor: '#e0b289',
          bottom: '36px',
          right: initialWidth / 2 - 150,
          height: '30px',
          width: '72px',
          userSelect: 'none',
        }}
      >
        <Slider
          keyboard={false}
          value={spaceshipThrust}
          min={0.1}
          max={5}
          step={0.1}
          tooltip={{ formatter: (value) => `${value}X` }}
          style={{ marginLeft: '10px', marginRight: '10px' }}
          onChange={(value) => {
            const controls = useRefStore.getState().controlsRef?.current;
            if (controls) {
              controls.moveSpeed = 5 * value;
              controls.turnSpeed = value;
            }
            setCommonStore((state) => {
              state.projectState.spaceshipThrust = value;
            });
          }}
        />
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            color: 'antiquewhite',
            bottom: '-13px',
            right: '20px',
            userSelect: 'none',
          }}
        >
          {t('spaceship.Thrust', lang)}
        </span>
      </span>

      {/*x coordinate*/}
      <span
        ref={xCoordinateFieldRef}
        title={t('spaceship.TeleportXCoordinate', lang)}
        style={{
          position: 'absolute',
          bottom: '36px',
          right: initialWidth / 2 - 210,
          height: '30px',
          userSelect: 'none',
        }}
      >
        <InputNumber
          value={navCoordinates[0]}
          precision={1}
          step={0.1}
          style={{ width: '55px', height: '30px', fontSize: '12px' }}
          onChange={(value) => {
            if (value === null) return;
            usePrimitiveStore.getState().set((state) => {
              state.navCoordinates[0] = value;
            });
            const controls = useRefStore.getState().controlsRef?.current;
            if (controls) {
              controls.object.position.x = value;
              controls.update(true);
            }
          }}
        />
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            color: 'antiquewhite',
            bottom: '-13px',
            right: '20px',
            userSelect: 'none',
          }}
        >
          x (Å)
        </span>
      </span>

      {/*y coordinate*/}
      <span
        ref={yCoordinateFieldRef}
        title={t('spaceship.TeleportYCoordinate', lang)}
        style={{
          position: 'absolute',
          bottom: '36px',
          right: initialWidth / 2 - 268,
          height: '30px',
          userSelect: 'none',
        }}
      >
        <InputNumber
          value={navCoordinates[1]}
          precision={1}
          step={0.1}
          style={{ width: '55px', height: '30px', fontSize: '12px' }}
          onChange={(value) => {
            if (value === null) return;
            usePrimitiveStore.getState().set((state) => {
              state.navCoordinates[1] = value;
            });
            const controls = useRefStore.getState().controlsRef?.current;
            if (controls) {
              controls.object.position.y = value;
              controls.update(true);
            }
          }}
        />
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            color: 'antiquewhite',
            bottom: '-13px',
            right: '20px',
            userSelect: 'none',
          }}
        >
          y (Å)
        </span>
      </span>

      {/*z coordinate*/}
      <span
        ref={zCoordinateFieldRef}
        title={t('spaceship.TeleportZCoordinate', lang)}
        style={{
          position: 'absolute',
          bottom: '36px',
          right: initialWidth / 2 - 326,
          height: '30px',
          userSelect: 'none',
        }}
      >
        <InputNumber
          value={navCoordinates[2]}
          precision={1}
          step={0.1}
          style={{ width: '55px', height: '30px', fontSize: '12px' }}
          onChange={(value) => {
            if (value === null) return;
            usePrimitiveStore.getState().set((state) => {
              state.navCoordinates[2] = value;
            });
            const controls = useRefStore.getState().controlsRef?.current;
            if (controls) {
              controls.object.position.z = value;
              controls.update(true);
            }
          }}
        />
        <span
          style={{
            position: 'absolute',
            fontSize: '10px',
            color: 'antiquewhite',
            bottom: '-13px',
            right: '20px',
            userSelect: 'none',
          }}
        >
          z (Å)
        </span>
      </span>
    </>
  );
});

export default Cockpit;
