/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';
import steeringWheel from '../assets/steering-wheel.png';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useRefStore } from '../stores/commonRef.ts';

const Cockpit = React.memo(() => {
  const chamberViewerPercentWidth = useStore(Selector.chamberViewerPercentWidth);
  const hideGallery = useStore(Selector.hideGallery);

  const upperCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lowerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const wheelRef = useRef<HTMLImageElement | null>(null);

  const [initialWidth, setInitialWidth] = useState<number | null>(null);
  const upperHeight = 80;
  const lowerHeight = 120;
  const wheelRadius = 40;

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

  const drawLowerPart = useCallback((width: number, key?: string) => {
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

    ctx.fillStyle = '#e0b289'; // keys color
    ctx.shadowColor = '#a88667';
    ctx.shadowBlur = 3;

    // keyboard - left
    const leftCenter = getW(27);
    ctx.shadowOffsetX = -1;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(leftCenter - 35, 10, 25, 25); // q
    ctx.fillRect(leftCenter, 10, 25, 25); // w
    ctx.fillRect(leftCenter + 35, 10, 25, 25); // e
    ctx.fillRect(leftCenter - 35, 45, 25, 25); // a
    ctx.fillRect(leftCenter, 45, 25, 25); // s
    ctx.fillRect(leftCenter + 35, 45, 25, 25); // d
    ctx.fillRect(leftCenter - 35, 80, 25, 25); // z
    ctx.fillRect(leftCenter, 80, 25, 25); // x

    // keyboard - right
    const rightCenter = getW(70);
    ctx.shadowOffsetX = 1;
    ctx.fillRect(rightCenter, 80, 25, 25); // down
    ctx.fillRect(rightCenter - 35, 80, 25, 25); // left
    ctx.fillRect(rightCenter + 35, 80, 25, 25); // right
    ctx.fillRect(rightCenter, 45, 25, 25); // up

    // highlight key
    if (key !== undefined) {
      ctx.fillStyle = '#f0de1a';
      switch (key) {
        case 'KeyQ': {
          ctx.fillRect(leftCenter - 36, 9, 25, 25); // q
          break;
        }
        case 'KeyW': {
          ctx.fillRect(getW(27), 10, 25, 25); // w
          break;
        }
        case 'KeyE': {
          ctx.fillRect(leftCenter + 35, 10, 25, 25); // e
          break;
        }
        case 'KeyA': {
          ctx.fillRect(leftCenter - 35, 45, 25, 25); // a
          break;
        }
        case 'KeyS': {
          ctx.fillRect(getW(27), 45, 25, 25); // s
          break;
        }
        case 'KeyD': {
          ctx.fillRect(leftCenter + 35, 45, 25, 25); // d
          break;
        }
        case 'KeyZ': {
          ctx.fillRect(leftCenter - 35, 80, 25, 25); // z
          break;
        }
        case 'KeyX': {
          ctx.fillRect(getW(27), 80, 25, 25); // x
          break;
        }
        case 'ArrowUp': {
          ctx.fillRect(rightCenter, 45, 25, 25);
          break;
        }
        case 'ArrowDown': {
          ctx.fillRect(rightCenter, 80, 25, 25);
          break;
        }
        case 'ArrowLeft': {
          ctx.fillRect(rightCenter - 35, 80, 25, 25);
          break;
        }
        case 'ArrowRight': {
          ctx.fillRect(rightCenter + 35, 80, 25, 25);
          break;
        }
      }
    }

    // text
    ctx.fillStyle = 'white'; // text color
    ctx.font = '20px serif';
    ctx.fillText('q', leftCenter - 35 + 7, 10 + 16.5); // q
    ctx.fillText('w', leftCenter + 5, 10 + 17.5); // w
    ctx.fillText('e', leftCenter + 8 + 35, 10 + 17.5); // e
    ctx.fillText('a', leftCenter + 7 - 35, 45 + 17.5); // a
    ctx.fillText('s', leftCenter + 8, 45 + 17.5); // s
    ctx.fillText('d', leftCenter + 7 + 35, 45 + 17.5); // d
    ctx.fillText('z', leftCenter + 7 - 35, 80 + 17.5); // z
    ctx.fillText('x', leftCenter + 7, 80 + 17.5); // x

    ctx.fillText('↓', rightCenter + 7.5, 80 + 17);
    ctx.fillText('←', rightCenter - 35 + 2, 80 + 18);
    ctx.fillText('→', rightCenter + 35 + 2, 80 + 18);
    ctx.fillText('↑', rightCenter + 8, 45 + 17);
  }, []);

  const getWidth = useCallback(() => {
    const rightChild = document.getElementById('split-pane-right-child');
    if (rightChild) {
      return rightChild.clientWidth;
    } else {
      return 1000;
    }
  }, []);

  const onResize = useCallback(() => {
    if (lowerCanvasRef.current && upperCanvasRef.current) {
      const width = getWidth();
      lowerCanvasRef.current.width = width;
      upperCanvasRef.current.width = width;
      drawLowerPart(width);
      drawUpperPart(width);
      if (wheelRef.current) {
        wheelRef.current.style.right = width / 2 - wheelRadius + 'px';
      }
    }
  }, [drawLowerPart]);

  // init width
  useEffect(() => {
    setInitialWidth(getWidth());
  }, [getWidth, setInitialWidth]);

  // init draw
  useEffect(() => {
    if (initialWidth === null) return;
    drawLowerPart(initialWidth);
    drawUpperPart(initialWidth);
  }, [initialWidth, drawLowerPart, drawUpperPart]);

  // listen to split pane resize
  useEffect(() => {
    onResize();
  }, [hideGallery, chamberViewerPercentWidth, onResize]);

  // add window resize event listener
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      drawLowerPart(getWidth(), e.code);
      if (e.code === 'ArrowLeft') {
        setKey('left');
      } else if (e.code === 'ArrowRight') {
        setKey('right');
      } else if (e.code === 'ArrowUp') {
        setKey('up');
      } else if (e.code === 'ArrowDown') {
        setKey('down');
      } else {
        setKey(null);
      }
    };

    const onKeyUp = () => {
      drawLowerPart(getWidth());
      setKey(null);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // update steering wheel by keyboard
  const [key, setKey] = useState<'left' | 'right' | 'up' | 'down' | null>(null); // only used for left/right
  useEffect(() => {
    if (!wheelRef.current) return;

    if (key === 'left') {
      wheelRef.current.style.transform = 'rotate(-60deg) translateY(0)';
    } else if (key === 'right') {
      wheelRef.current.style.transform = 'rotate(60deg) translateY(0)';
    } else if (key === 'up') {
      wheelRef.current.style.transform = 'rotate(0) translateY(-20px) perspective(100px) rotateX(45deg)';
    } else if (key === 'down') {
      wheelRef.current.style.transform = 'rotate(0) translateY(20px) perspective(100px) rotateX(-45deg)';
    } else {
      wheelRef.current.style.transform = 'rotate(0) translateY(0)';
    }
  }, [key]);

  if (initialWidth === null) return null;

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
      {/* lower part */}
      <canvas
        ref={lowerCanvasRef}
        width={initialWidth}
        height={lowerHeight}
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          pointerEvents: 'none',
        }}
      />
      {/* steering wheel */}
      <img
        alt={'wheel'}
        ref={wheelRef}
        src={steeringWheel}
        style={{
          position: 'absolute',
          bottom: '25px',
          right: initialWidth / 2 - wheelRadius,
          height: wheelRadius * 2 + 'px',
          width: wheelRadius * 2 + 'px',
          transition: 'transform 0.3s ease',
          userSelect: 'none',
        }}
      />
      <ArrowUpOutlined
        style={{
          position: 'absolute',
          backgroundColor: '#e0b289',
          padding: '5px',
          color: 'antiquewhite',
          bottom: '100px',
          right: initialWidth / 2 - 10,
          height: '20px',
          width: '20px',
        }}
        onClick={() => {
          console.log(useRefStore.getState().controlsRef);
        }}
      />
    </>
  );
});

export default Cockpit;
