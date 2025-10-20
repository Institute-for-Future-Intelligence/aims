/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import { MainMenuItem } from '../menuItem';
import {
  AutoRotateCheckBox,
  AxesCheckBox,
  BackgroundColor,
  ColoringRadioSubmenu,
  ContainerCheckBox,
  FogCheckBox,
  GlobalStyleRadioSubmenu,
  MaterialRadioSubmenu,
  NavigationViewCheckBox,
  Screenshot,
  ViewAngleSubmenu,
} from './sharedMenuItems.tsx';
import { RotateLigandSubmenu, TranslateLigandSubmenu } from './drugDiscoveryMenuItems.tsx';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import * as Selector from '../../stores/selector';

const DrugDiscoveryMenu = () => {
  const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const protein = useStore(Selector.protein);
  const ligand = useStore(Selector.ligand);

  let pickedMolecule = null;
  if (pickedMoleculeIndex === 0) pickedMolecule = protein;
  else if (pickedMoleculeIndex === 1) pickedMolecule = ligand;

  return (
    <>
      {pickedMolecule ? (
        <>
          {/* molecule-name */}
          <MainMenuItem stayAfterClick={false} fontWeight="bold">
            {pickedMolecule.name}
          </MainMenuItem>
          <hr />

          {pickedMolecule === ligand ? (
            <>
              {/* translate-ligand-submenu */}
              <TranslateLigandSubmenu />

              {/* rotate-molecule-submenu */}
              <RotateLigandSubmenu />
            </>
          ) : (
            <>
              {/* molecular-viewer-style-submenu */}
              <GlobalStyleRadioSubmenu />

              {/* molecular-viewer-material-submenu */}
              <MaterialRadioSubmenu />

              {/* molecular-viewer-coloring-submenu */}
              <ColoringRadioSubmenu />
            </>
          )}
        </>
      ) : (
        <>
          {/* molecular-viewer-auto-rotate */}
          <AutoRotateCheckBox />

          {/* molecular-viewer-navigation-mode */}
          <NavigationViewCheckBox popup={true} />

          {/* molecular-viewer-axes */}
          <AxesCheckBox />

          {/* molecular-viewer-container */}
          <ContainerCheckBox />

          {/* molecular-viewer-foggy */}
          <FogCheckBox />

          {/* molecular-viewer-view-angle-submenu */}
          <ViewAngleSubmenu />

          {/* molecular-viewer-background-color */}
          <BackgroundColor />

          {/* molecular-viewer-screenshot */}
          <Screenshot />
        </>
      )}
    </>
  );
};

export default DrugDiscoveryMenu;
