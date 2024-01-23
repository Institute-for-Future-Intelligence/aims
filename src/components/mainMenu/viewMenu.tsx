/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MenuProps } from 'antd';
import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common';
import { LabelMark, MenuItem } from '../menuItem';
import {
  AutoRotateCheckBox,
  AxesCheckBox,
  BackgroundColor,
  ColoringRadioGroup,
  MaterialRadioGroup,
  StyleRadioGroup,
} from '../contextMenu/defaultMenuItems';
import { useRefStore } from '../../stores/commonRef';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { UndoableCameraChange } from '../../undo/UndoableCameraChange';
import { UndoableResetView } from '../../undo/UndoableResetView';

export const resetView = () => {
  const cameraPosition = useStore.getState().cameraPosition;
  const panCenter = useStore.getState().panCenter;
  // if not already reset
  if (
    cameraPosition[0] !== cameraPosition[1] ||
    cameraPosition[1] !== cameraPosition[2] ||
    cameraPosition[0] !== cameraPosition[2] ||
    panCenter[0] !== 0 ||
    panCenter[1] !== 0 ||
    panCenter[2] !== 0
  ) {
    const undoableResetView = {
      name: 'Reset View',
      timestamp: Date.now(),
      oldCameraPosition: [...cameraPosition],
      oldPanCenter: [...panCenter],
      undo: () => {
        const orbitControlsRef = useRefStore.getState().orbitControlsRef;
        if (orbitControlsRef?.current) {
          orbitControlsRef.current.object.position.set(
            undoableResetView.oldCameraPosition[0],
            undoableResetView.oldCameraPosition[1],
            undoableResetView.oldCameraPosition[2],
          );
          orbitControlsRef.current.target.set(
            undoableResetView.oldPanCenter[0],
            undoableResetView.oldPanCenter[1],
            undoableResetView.oldPanCenter[2],
          );
          orbitControlsRef.current.update();
          useStore.getState().set((state) => {
            state.cameraPosition = [...undoableResetView.oldCameraPosition];
            state.panCenter = [...undoableResetView.oldPanCenter];
          });
        }
      },
      redo: () => {
        setDefaultViewPosition();
      },
    } as UndoableResetView;
    useStore.getState().addUndoable(undoableResetView);
    setDefaultViewPosition();
  }
};

const setDefaultViewPosition = () => {
  const orbitControlsRef = useRefStore.getState().orbitControlsRef;
  if (orbitControlsRef?.current) {
    // I don't know why the reset method results in a black screen.
    // So we are resetting it here to a predictable position.
    const r = 2 * usePrimitiveStore.getState().boundingSphereRadius;
    orbitControlsRef.current.object.position.set(r, r, r);
    orbitControlsRef.current.target.set(0, 0, 0);
    orbitControlsRef.current.update();
    useStore.getState().set((state) => {
      state.cameraPosition = [r, r, r];
      state.panCenter = [0, 0, 0];
    });
  }
};

export const zoomView = (scale: number) => {
  const orbitControlsRef = useRefStore.getState().orbitControlsRef;
  if (orbitControlsRef?.current) {
    const p = orbitControlsRef.current.object.position;
    const x = p.x * scale;
    const y = p.y * scale;
    const z = p.z * scale;
    const undoableCameraChange = {
      name: 'Zoom',
      timestamp: Date.now(),
      oldCameraPosition: [p.x, p.y, p.z],
      newCameraPosition: [x, y, z],
      undo: () => {
        const oldX = undoableCameraChange.oldCameraPosition[0];
        const oldY = undoableCameraChange.oldCameraPosition[1];
        const oldZ = undoableCameraChange.oldCameraPosition[2];
        orbitControlsRef.current?.object.position.set(oldX, oldY, oldZ);
        orbitControlsRef.current?.update();
        useStore.getState().set((state) => {
          state.cameraPosition = [oldX, oldY, oldZ];
        });
      },
      redo: () => {
        const newX = undoableCameraChange.newCameraPosition[0];
        const newY = undoableCameraChange.newCameraPosition[1];
        const newZ = undoableCameraChange.newCameraPosition[2];
        orbitControlsRef.current?.object.position.set(newX, newY, newZ);
        orbitControlsRef.current?.update();
        useStore.getState().set((state) => {
          state.cameraPosition = [newX, newY, newZ];
        });
      },
    } as UndoableCameraChange;
    useStore.getState().addUndoable(undoableCameraChange);
    orbitControlsRef.current.object.position.set(x, y, z);
    orbitControlsRef.current.update();
    useStore.getState().set((state) => {
      state.cameraPosition = [x, y, z];
    });
  }
};

export const createViewMenu = (keyHome: string, isMac: boolean) => {
  const lang = { lng: useStore.getState().language };

  const handleResetView = () => {
    resetView();
  };

  const handleZoomOut = () => {
    zoomView(1.1);
  };

  const handleZoomIn = () => {
    zoomView(0.9);
  };

  const items: MenuProps['items'] = [];

  items.push({
    key: 'reset-view',
    label: (
      <MenuItem hasPadding={true} onClick={handleResetView}>
        {i18n.t('menu.view.ResetView', lang)}
        <LabelMark>({keyHome})</LabelMark>
      </MenuItem>
    ),
  });

  items.push({
    key: 'zoom-out-view',
    label: (
      <MenuItem hasPadding={true} onClick={handleZoomOut}>
        {i18n.t('menu.view.ZoomOut', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+])</LabelMark>
      </MenuItem>
    ),
  });

  items.push({
    key: 'zoom-in-view',
    label: (
      <MenuItem hasPadding={true} onClick={handleZoomIn}>
        {i18n.t('menu.view.ZoomIn', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+[)</LabelMark>
      </MenuItem>
    ),
  });

  items.push({
    key: 'auto-rotate-check-box',
    label: <AutoRotateCheckBox isMac={isMac} />,
  });

  items.push({
    key: 'axes-check-box',
    label: <AxesCheckBox />,
  });

  items.push({
    key: 'background-color',
    label: <BackgroundColor />,
  });

  items.push({
    key: 'display-style',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Style', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-style-radio-group',
        label: <StyleRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  items.push({
    key: 'display-material',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Material', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-material-radio-group',
        label: <MaterialRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  items.push({
    key: 'display-coloring',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Color', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-coloring-radio-group',
        label: <ColoringRadioGroup />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  return items;
};
