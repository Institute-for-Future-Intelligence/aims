/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common';
import { LabelMark, MainMenuItem, MainSubMenu } from '../menuItem';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { ProjectType } from '../../constants.ts';
import {
  AutoRotateCheckBox,
  AxesCheckBox,
  BackgroundColor,
  ColoringRadioSubmenu,
  ContainerCheckBox,
  FogCheckBox,
  GalleryCheckBox,
  GlobalStyleRadioSubmenu,
  MaterialRadioSubmenu,
  NavigationViewCheckBox,
} from '../contextMenu/sharedMenuItems.tsx';
import {
  AngularBondsCheckBox,
  ForceVectorCheckBox,
  MomentumVectorCheckBox,
  TorsionalBondsCheckBox,
  VdwBondsCheckBox,
} from '../contextMenu/molecularModelingMenuItems.tsx';
import { useLanguage } from '../../hooks.ts';
import { SubMenu } from '@szhsin/react-menu';
import { t } from 'i18next';

export const resetView = () => {
  usePrimitiveStore.getState().resetView();
};

export const zoomView = (scale: number) => {
  usePrimitiveStore.getState().zoomView(scale);
};

interface Props {
  keyHome: string;
  isMac: boolean;
}

const ViewMenu = ({ keyHome, isMac }: Props) => {
  const lang = useLanguage();
  const projectType = useStore((state) => state.projectState.type);

  const handleResetView = () => {
    resetView();
  };

  const handleZoomOut = () => {
    zoomView(1.1);
  };

  const handleZoomIn = () => {
    zoomView(0.9);
  };

  return (
    <SubMenu label={t('menu.viewSubMenu', lang)}>
      {/* reset view */}
      <MainMenuItem stayAfterClick hasPadding onClick={handleResetView}>
        {i18n.t('menu.view.ResetView', lang)}
        <LabelMark>({keyHome})</LabelMark>
      </MainMenuItem>

      {/* zoom out */}
      <MainMenuItem stayAfterClick hasPadding onClick={handleZoomOut}>
        {i18n.t('menu.view.ZoomOut', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+])</LabelMark>
      </MainMenuItem>

      {/* zoom in */}
      <MainMenuItem stayAfterClick hasPadding onClick={handleZoomIn}>
        {i18n.t('menu.view.ZoomIn', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+[)</LabelMark>
      </MainMenuItem>

      <NavigationViewCheckBox isMac={isMac} />

      <GalleryCheckBox />

      <AutoRotateCheckBox isMac={isMac} />

      <AxesCheckBox />

      <ContainerCheckBox />

      {projectType === ProjectType.MOLECULAR_MODELING && (
        <MainSubMenu hasPadding label={i18n.t('molecularViewer.Mechanics', lang)}>
          {/* molecular-viewer-vdw-bonds */}
          <VdwBondsCheckBox />

          {/* molecular-viewer-angular-bonds */}
          <AngularBondsCheckBox />

          {/* molecular-viewer-torsional-bonds */}
          <TorsionalBondsCheckBox />

          {/* molecular-viewer-momentum-vectors */}
          <MomentumVectorCheckBox />

          {/* molecular-viewer-force-vectors */}
          <ForceVectorCheckBox />
        </MainSubMenu>
      )}

      <GlobalStyleRadioSubmenu hasPadding />

      <MaterialRadioSubmenu hasPadding />

      <ColoringRadioSubmenu hasPadding />

      <FogCheckBox />

      <BackgroundColor />
    </SubMenu>
  );
};

export default ViewMenu;
