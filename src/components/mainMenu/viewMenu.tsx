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
  ColoringRadioGroup,
  ShininessInput,
  StyleRadioGroup,
} from '../contextMenu/defaultMenuItems';

export const createViewMenu = (
  keyHome: string,
  isMac: boolean,
  zoomView: (scale: number) => void,
  resetView: () => void,
) => {
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

  // reset-view
  items.push({
    key: 'reset-view',
    label: (
      <MenuItem hasPadding={true} onClick={handleResetView}>
        {i18n.t('menu.view.ResetView', lang)}
        <LabelMark>({keyHome})</LabelMark>
      </MenuItem>
    ),
  });

  // zoom-out-view
  items.push({
    key: 'zoom-out-view',
    label: (
      <MenuItem hasPadding={true} onClick={handleZoomOut}>
        {i18n.t('menu.view.ZoomOut', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+])</LabelMark>
      </MenuItem>
    ),
  });

  // zoom-in-view
  items.push({
    key: 'zoom-in-view',
    label: (
      <MenuItem hasPadding={true} onClick={handleZoomIn}>
        {i18n.t('menu.view.ZoomIn', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+[)</LabelMark>
      </MenuItem>
    ),
  });

  // auto-rotate-check-box
  items.push({
    key: 'auto-rotate-check-box',
    label: <AutoRotateCheckBox />,
  });

  // axes-check-box
  items.push({
    key: 'axes-check-box',
    label: <AxesCheckBox />,
  });

  // display style
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

  // display coloring
  items.push({
    key: 'display-coloring',
    label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Color', lang)}</MenuItem>,
    children: [
      {
        key: 'molecular-viewer-coloring-radio-group',
        label: <ColoringRadioGroup />,
        style: { backgroundColor: 'white' },
      },
      {
        key: 'molecular-viewer-shininess',
        label: <ShininessInput />,
        style: { backgroundColor: 'white' },
      },
    ],
  });

  return items;
};
