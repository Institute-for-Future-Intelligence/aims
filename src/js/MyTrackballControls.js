/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { EventDispatcher, MathUtils, MOUSE, Quaternion, Vector2, Vector3 } from 'three';

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class MyTrackballControls extends EventDispatcher {
  constructor(object, domElement) {
    super();

    const scope = this;
    const STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

    this.object = object;
    this.domElement = domElement;
    this.domElement.style.touchAction = 'none'; // disable touch scroll

    // API

    this.enabled = true;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;

    this.staticMoving = false;
    this.dynamicDampingFactor = 0.2;

    this.minDistance = 0;
    this.maxDistance = Infinity;

    this.minZoom = 0;
    this.maxZoom = Infinity;

    // this.keys = ['KeyA' /*A*/, 'KeyS' /*S*/, 'KeyD' /*D*/];
    this.moveSpeed = 5;
    this.turnSpeed = 1;
    this.keys = {
      MOVE_LEFT: 'KeyA',
      MOVE_RIGHT: 'KeyD',
      MOVE_FORWARD: 'KeyW',
      MOVE_BACKWARD: 'KeyS',
      MOVE_UP: 'KeyZ',
      MOVE_DOWN: 'KeyX',
      ROLL_LEFT: 'KeyQ',
      ROLL_RIGHT: 'KeyE',
      ROTATE_LEFT: 'ArrowLeft',
      ROTATE_UP: 'ArrowUp',
      ROTATE_RIGHT: 'ArrowRight',
      ROTATE_DOWN: 'ArrowDown',
    };

    this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };

    // AIMS specific
    this.autoRotate = false;
    this.autoRotateSpeed = 1.0;

    this.onStart = null;
    this.onChange = null;
    this.onEnd = null;

    // internals

    this.target = new Vector3();

    const EPS = 0.000001;

    const lastPosition = new Vector3();
    let lastZoom = 1;

    let _state = STATE.NONE,
      _keyState = STATE.NONE,
      _touchZoomDistanceStart = 0,
      _touchZoomDistanceEnd = 0,
      _lastAngle = 0;

    const _eye = new Vector3(),
      _movePrev = new Vector2(),
      _moveCurr = new Vector2(),
      _lastAxis = new Vector3(),
      _zoomStart = new Vector2(),
      _zoomEnd = new Vector2(),
      _panStart = new Vector2(),
      _panEnd = new Vector2(),
      _pointers = [],
      _pointerPositions = {};

    // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();
    this.zoom0 = this.object.zoom;

    // methods

    this.listenToKeyEvents = function (domElement) {
      domElement.addEventListener('keydown', keydown);
      this._domElementKeyEvents = domElement;
    };

    this.removeKeyEvents = function () {
      if (scope._domElementKeyEvents !== null) {
        scope._domElementKeyEvents.removeEventListener('keydown', keydown);
      }
    };

    this.handleResize = function () {
      const box = scope.domElement.getBoundingClientRect();
      // adjustments come from similar code in the jquery offset() function
      const d = scope.domElement.ownerDocument.documentElement;
      scope.screen.left = box.left + window.scrollX - d.clientLeft;
      scope.screen.top = box.top + window.scrollY - d.clientTop;
      scope.screen.width = box.width;
      scope.screen.height = box.height;
    };

    const getMouseOnScreen = (function () {
      const vector = new Vector2();

      return function getMouseOnScreen(pageX, pageY) {
        vector.set((pageX - scope.screen.left) / scope.screen.width, (pageY - scope.screen.top) / scope.screen.height);

        return vector;
      };
    })();

    const getMouseOnCircle = (function () {
      const vector = new Vector2();

      return function getMouseOnCircle(pageX, pageY) {
        vector.set(
          (pageX - scope.screen.width * 0.5 - scope.screen.left) / (scope.screen.width * 0.5),
          (scope.screen.height + 2 * (scope.screen.top - pageY)) / scope.screen.width, // screen.width intentional
        );

        return vector;
      };
    })();

    this.rotateCamera = (function () {
      const axis = new Vector3(),
        quaternion = new Quaternion(),
        eyeDirection = new Vector3(),
        objectUpDirection = new Vector3(),
        objectSidewaysDirection = new Vector3(),
        moveDirection = new Vector3();

      return function rotateCamera() {
        moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
        let angle = moveDirection.length();
        if (angle) {
          _eye.copy(scope.object.position).sub(scope.target);

          eyeDirection.copy(_eye).normalize();
          objectUpDirection.copy(scope.object.up).normalize();
          objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();

          objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
          objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);

          moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

          axis.crossVectors(moveDirection, _eye).normalize();

          angle *= scope.rotateSpeed;
          quaternion.setFromAxisAngle(axis, angle);

          _eye.applyQuaternion(quaternion);
          scope.object.up.applyQuaternion(quaternion);

          _lastAxis.copy(axis);
          _lastAngle = angle;
        } else if (!scope.staticMoving && _lastAngle) {
          _lastAngle *= Math.sqrt(1.0 - scope.dynamicDampingFactor);
          _eye.copy(scope.object.position).sub(scope.target);
          quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
          _eye.applyQuaternion(quaternion);
          scope.object.up.applyQuaternion(quaternion);
        }

        _movePrev.copy(_moveCurr);
      };
    })();

    this.zoomCamera = function () {
      let factor;

      if (_state === STATE.TOUCH_ZOOM_PAN) {
        factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
        _touchZoomDistanceStart = _touchZoomDistanceEnd;

        if (scope.object.isPerspectiveCamera) {
          _eye.multiplyScalar(factor);
        } else if (scope.object.isOrthographicCamera) {
          scope.object.zoom = MathUtils.clamp(scope.object.zoom / factor, scope.minZoom, scope.maxZoom);

          if (lastZoom !== scope.object.zoom) {
            scope.object.updateProjectionMatrix();
          }
        } else {
          console.warn('THREE.TrackballControls: Unsupported camera type');
        }
      } else {
        factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * scope.zoomSpeed;

        if (factor !== 1.0 && factor > 0.0) {
          if (scope.object.isPerspectiveCamera) {
            _eye.multiplyScalar(factor);
          } else if (scope.object.isOrthographicCamera) {
            scope.object.zoom = MathUtils.clamp(scope.object.zoom / factor, scope.minZoom, scope.maxZoom);

            if (lastZoom !== scope.object.zoom) {
              scope.object.updateProjectionMatrix();
            }
          } else {
            console.warn('THREE.TrackballControls: Unsupported camera type');
          }
        }

        if (scope.staticMoving) {
          _zoomStart.copy(_zoomEnd);
        } else {
          _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;
        }
      }
    };

    this.panCamera = (function () {
      const mouseChange = new Vector2(),
        objectUp = new Vector3(),
        pan = new Vector3();

      return function panCamera() {
        mouseChange.copy(_panEnd).sub(_panStart);

        if (mouseChange.lengthSq()) {
          if (scope.object.isOrthographicCamera) {
            const scale_x = (scope.object.right - scope.object.left) / scope.object.zoom / scope.domElement.clientWidth;
            const scale_y = (scope.object.top - scope.object.bottom) / scope.object.zoom / scope.domElement.clientWidth;

            mouseChange.x *= scale_x;
            mouseChange.y *= scale_y;
          }

          mouseChange.multiplyScalar(_eye.length() * scope.panSpeed);

          pan.copy(_eye).cross(scope.object.up).setLength(mouseChange.x);
          pan.add(objectUp.copy(scope.object.up).setLength(mouseChange.y));

          scope.object.position.add(pan);
          scope.target.add(pan);

          if (scope.staticMoving) {
            _panStart.copy(_panEnd);
          } else {
            _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(scope.dynamicDampingFactor));
          }
        }
      };
    })();

    this.checkDistances = function () {
      if (!scope.noZoom || !scope.noPan) {
        if (_eye.lengthSq() > scope.maxDistance * scope.maxDistance) {
          scope.object.position.addVectors(scope.target, _eye.setLength(scope.maxDistance));
          _zoomStart.copy(_zoomEnd);
        }

        if (_eye.lengthSq() < scope.minDistance * scope.minDistance) {
          scope.object.position.addVectors(scope.target, _eye.setLength(scope.minDistance));
          _zoomStart.copy(_zoomEnd);
        }
      }
    };

    this.update = function () {
      _eye.subVectors(scope.object.position, scope.target);

      if (!scope.noRotate) {
        // AIMS specific
        if (scope.autoRotate && _state === STATE.NONE) {
          _movePrev.copy(_moveCurr);
          _moveCurr.setX(_movePrev.x + 0.001 * this.autoRotateSpeed);
        }
        scope.rotateCamera();
      }

      if (!scope.noZoom) {
        scope.zoomCamera();
      }

      if (!scope.noPan) {
        scope.panCamera();
      }

      scope.object.position.addVectors(scope.target, _eye);

      if (scope.object.isPerspectiveCamera) {
        scope.checkDistances();

        scope.object.lookAt(scope.target);

        scope.dispatchEvent(_changeEvent);
        if (scope.onChange) {
          scope.onChange();
        }

        lastPosition.copy(scope.object.position);
      } else if (scope.object.isOrthographicCamera) {
        scope.object.lookAt(scope.target);

        if (lastPosition.distanceToSquared(scope.object.position) > EPS || lastZoom !== scope.object.zoom) {
          scope.dispatchEvent(_changeEvent);
          if (scope.onChange) {
            scope.onChange();
          }

          lastPosition.copy(scope.object.position);
          lastZoom = scope.object.zoom;
        }
      } else {
        console.warn('THREE.TrackballControls: Unsupported camera type');
      }
    };

    this.reset = function () {
      _state = STATE.NONE;
      _keyState = STATE.NONE;

      scope.target.copy(scope.target0);
      scope.object.position.copy(scope.position0);
      scope.object.up.copy(scope.up0);
      scope.object.zoom = scope.zoom0;

      scope.object.updateProjectionMatrix();

      _eye.subVectors(scope.object.position, scope.target);

      scope.object.lookAt(scope.target);

      scope.dispatchEvent(_changeEvent);
      if (scope.onChange) {
        scope.onChange();
      }

      lastPosition.copy(scope.object.position);
      lastZoom = scope.object.zoom;
    };

    // listeners

    function onPointerDown(event) {
      if (scope.enabled === false) return;

      if (_pointers.length === 0) {
        scope.domElement.setPointerCapture(event.pointerId);

        scope.domElement.addEventListener('pointermove', onPointerMove);
        scope.domElement.addEventListener('pointerup', onPointerUp);
      }

      //

      addPointer(event);

      if (event.pointerType === 'touch') {
        onTouchStart(event);
      } else {
        onMouseDown(event);
      }
    }

    function onPointerMove(event) {
      if (scope.enabled === false) return;

      if (event.pointerType === 'touch') {
        onTouchMove(event);
      } else {
        onMouseMove(event);
      }
    }

    function onPointerUp(event) {
      if (scope.enabled) {
        if (event.pointerType === 'touch') {
          onTouchEnd(event);
        } else {
          onMouseUp();
        }
      }

      //

      removePointer(event);

      if (_pointers.length === 0) {
        scope.domElement.releasePointerCapture(event.pointerId);

        scope.domElement.removeEventListener('pointermove', onPointerMove);
        scope.domElement.removeEventListener('pointerup', onPointerUp);
      }
    }

    function onPointerCancel(event) {
      removePointer(event);
    }

    function keydown(event) {
      if (scope.enabled === false) return;

      switch (event.code) {
        case scope.keys.MOVE_FORWARD:
          scope.moveForward(scope.moveSpeed);
          break;

        case scope.keys.MOVE_BACKWARD:
          scope.moveForward(-scope.moveSpeed);
          break;

        case scope.keys.MOVE_RIGHT:
          scope.moveRight(scope.moveSpeed);
          break;

        case scope.keys.MOVE_LEFT:
          scope.moveRight(-scope.moveSpeed);
          break;

        case scope.keys.MOVE_UP:
          scope.moveUp(scope.moveSpeed);
          break;

        case scope.keys.MOVE_DOWN:
          scope.moveUp(-scope.moveSpeed);
          break;

        case scope.keys.ROLL_LEFT:
          scope.rollRight(scope.turnSpeed);
          break;

        case scope.keys.ROLL_RIGHT:
          scope.rollRight(-scope.turnSpeed);
          break;

        case scope.keys.ROTATE_UP:
          scope.spinUp(scope.turnSpeed);
          break;

        case scope.keys.ROTATE_DOWN:
          scope.spinUp(-scope.turnSpeed);
          break;

        case scope.keys.ROTATE_LEFT:
          scope.spinRight(-scope.turnSpeed);
          break;

        case scope.keys.ROTATE_RIGHT:
          scope.spinRight(scope.turnSpeed);
          break;
      }
    }

    function keyup() {
      if (scope.enabled === false) return;

      _keyState = STATE.NONE;

      window.addEventListener('keydown', keydown);
    }

    function onMouseDown(event) {
      if (_state === STATE.NONE) {
        switch (event.button) {
          case scope.mouseButtons.LEFT:
            _state = STATE.ROTATE;
            break;

          case scope.mouseButtons.MIDDLE:
            _state = STATE.ZOOM;
            break;

          case scope.mouseButtons.RIGHT:
            _state = STATE.PAN;
            break;
        }
      }

      const state = _keyState !== STATE.NONE ? _keyState : _state;

      if (state === STATE.ROTATE && !scope.noRotate) {
        _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
        _movePrev.copy(_moveCurr);
      } else if (state === STATE.ZOOM && !scope.noZoom) {
        _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _zoomEnd.copy(_zoomStart);
      } else if (state === STATE.PAN && !scope.noPan) {
        _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
        _panEnd.copy(_panStart);
      }

      scope.dispatchEvent(_startEvent);
      if (scope.onStart) {
        scope.onStart();
      }
    }

    function onMouseMove(event) {
      const state = _keyState !== STATE.NONE ? _keyState : _state;

      if (state === STATE.ROTATE && !scope.noRotate) {
        _movePrev.copy(_moveCurr);
        _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
      } else if (state === STATE.ZOOM && !scope.noZoom) {
        _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      } else if (state === STATE.PAN && !scope.noPan) {
        _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));
      }
    }

    function onMouseUp() {
      _state = STATE.NONE;

      scope.dispatchEvent(_endEvent);
      if (scope.onEnd) {
        scope.onEnd();
      }
    }

    function onMouseWheel(event) {
      if (scope.enabled === false) return;

      if (scope.noZoom === true) return;

      event.preventDefault();

      switch (event.deltaMode) {
        case 2:
          // Zoom in pages
          _zoomStart.y -= event.deltaY * 0.025;
          break;

        case 1:
          // Zoom in lines
          _zoomStart.y -= event.deltaY * 0.01;
          break;

        default:
          // undefined, 0, assume pixels
          _zoomStart.y -= event.deltaY * 0.00025;
          break;
      }

      scope.dispatchEvent(_startEvent);
      scope.dispatchEvent(_endEvent);
      if (scope.onStart) {
        scope.onStart();
      }
      if (scope.onEnd) {
        scope.onEnd();
      }
    }

    function onTouchStart(event) {
      trackPointer(event);

      switch (_pointers.length) {
        case 1:
          _state = STATE.TOUCH_ROTATE;
          _moveCurr.copy(getMouseOnCircle(_pointers[0].pageX, _pointers[0].pageY));
          _movePrev.copy(_moveCurr);
          break;

        default: // 2 or more
          _state = STATE.TOUCH_ZOOM_PAN;
          const dx = _pointers[0].pageX - _pointers[1].pageX;
          const dy = _pointers[0].pageY - _pointers[1].pageY;
          _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

          const x = (_pointers[0].pageX + _pointers[1].pageX) / 2;
          const y = (_pointers[0].pageY + _pointers[1].pageY) / 2;
          _panStart.copy(getMouseOnScreen(x, y));
          _panEnd.copy(_panStart);
          break;
      }

      scope.dispatchEvent(_startEvent);
      if (scope.onStart) {
        scope.onStart();
      }
    }

    function onTouchMove(event) {
      trackPointer(event);

      switch (_pointers.length) {
        case 1:
          _movePrev.copy(_moveCurr);
          _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
          break;

        default: // 2 or more
          const position = getSecondPointerPosition(event);

          const dx = event.pageX - position.x;
          const dy = event.pageY - position.y;
          _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

          const x = (event.pageX + position.x) / 2;
          const y = (event.pageY + position.y) / 2;
          _panEnd.copy(getMouseOnScreen(x, y));
          break;
      }
    }

    function onTouchEnd(event) {
      switch (_pointers.length) {
        case 0:
          _state = STATE.NONE;
          break;

        case 1:
          _state = STATE.TOUCH_ROTATE;
          _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
          _movePrev.copy(_moveCurr);
          break;

        case 2:
          _state = STATE.TOUCH_ZOOM_PAN;

          for (let i = 0; i < _pointers.length; i++) {
            if (_pointers[i].pointerId !== event.pointerId) {
              const position = _pointerPositions[_pointers[i].pointerId];
              _moveCurr.copy(getMouseOnCircle(position.x, position.y));
              _movePrev.copy(_moveCurr);
              break;
            }
          }

          break;
      }

      scope.dispatchEvent(_endEvent);
      if (scope.onEnd) {
        scope.onEnd();
      }
    }

    function contextmenu(event) {
      if (scope.enabled === false) return;

      event.preventDefault();
    }

    function addPointer(event) {
      _pointers.push(event);
    }

    function removePointer(event) {
      delete _pointerPositions[event.pointerId];

      for (let i = 0; i < _pointers.length; i++) {
        if (_pointers[i].pointerId === event.pointerId) {
          _pointers.splice(i, 1);
          return;
        }
      }
    }

    function trackPointer(event) {
      let position = _pointerPositions[event.pointerId];

      if (position === undefined) {
        position = new Vector2();
        _pointerPositions[event.pointerId] = position;
      }

      position.set(event.pageX, event.pageY);
    }

    function getSecondPointerPosition(event) {
      const pointer = event.pointerId === _pointers[0].pointerId ? _pointers[1] : _pointers[0];

      return _pointerPositions[pointer.pointerId];
    }

    this.moveForward = (function () {
      const _step = new Vector3();

      return function moveForward(distance) {
        const camera = scope.object;

        _step
          .subVectors(scope.target, camera.position)
          .normalize()
          .multiplyScalar(distance * 0.1);

        camera.position.add(_step);

        scope.target.add(_step);

        scope.dispatchEvent(_changeEvent);

        scope.dispatchEvent(_endEvent);
      };
    })();

    this.moveRight = (function () {
      const _step = new Vector3(0, 0, 0);

      return function moveRight(distance) {
        const camera = scope.object;

        _step
          .subVectors(scope.target, camera.position)
          .cross(camera.up)
          .setLength(distance * 0.1);

        camera.position.add(_step);

        scope.target.add(_step);

        scope.dispatchEvent(_changeEvent);

        scope.dispatchEvent(_endEvent);
      };
    })();

    this.moveUp = (function () {
      const _step = new Vector3(0, 0, 0);

      return function moveUp(distance) {
        const camera = scope.object;

        _step.copy(camera.up).setLength(distance * 0.1);

        camera.position.add(_step);

        scope.target.add(_step);

        scope.dispatchEvent(_changeEvent);

        scope.dispatchEvent(_endEvent);
      };
    })();

    this.spinRight = (function () {
      const _axis = new Vector3(0, 1, 0);
      const _direction = new Vector3();

      return function spinRight(distance) {
        const camera = scope.object;

        camera.rotateOnAxis(_axis, -0.01 * distance);

        _eye.subVectors(scope.target, camera.position);

        scope.target.addVectors(camera.position, camera.getWorldDirection(_direction).multiplyScalar(_eye.length()));

        scope.dispatchEvent(_changeEvent);

        scope.dispatchEvent(_endEvent);
      };
    })();

    this.rollRight = (function () {
      const _axis = new Vector3(0, 0, 1);
      const _up = new Vector3(0, 1, 0);

      return function rotateUp(distance) {
        const camera = scope.object;

        camera.rotateOnAxis(_axis, 0.01 * distance);

        camera.up.copy(_up).applyQuaternion(camera.quaternion);

        scope.dispatchEvent(_changeEvent);

        scope.dispatchEvent(_endEvent);
      };
    })();

    this.spinUp = (function () {
      const _axis = new Vector3(1, 0, 0);
      const _direction = new Vector3();
      const _up = new Vector3(0, 1, 0);

      return function rotateUp(distance) {
        const camera = scope.object;

        camera.rotateOnAxis(_axis, 0.01 * distance);

        camera.up.copy(_up).applyQuaternion(camera.quaternion);

        _eye.subVectors(scope.target, camera.position);

        scope.target.addVectors(camera.position, camera.getWorldDirection(_direction).multiplyScalar(_eye.length()));

        scope.dispatchEvent(_changeEvent);

        scope.dispatchEvent(_endEvent);
      };
    })();

    this.dispose = function () {
      scope.domElement.removeEventListener('contextmenu', contextmenu);

      scope.domElement.removeEventListener('pointerdown', onPointerDown);
      scope.domElement.removeEventListener('pointercancel', onPointerCancel);
      scope.domElement.removeEventListener('wheel', onMouseWheel);
      scope.domElement.removeEventListener('pointermove', onPointerMove);
      scope.domElement.removeEventListener('pointerup', onPointerUp);

      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };

    this.domElement.addEventListener('contextmenu', contextmenu);

    this.domElement.addEventListener('pointerdown', onPointerDown);
    this.domElement.addEventListener('pointercancel', onPointerCancel);
    this.domElement.addEventListener('wheel', onMouseWheel, { passive: false });

    this.handleResize();

    // force an update at start
    this.update();
  }
}

export { MyTrackballControls };
