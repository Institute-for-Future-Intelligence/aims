/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import i18n from '../../i18n/i18n';
import { MenuProps } from 'antd';
import { MenuItem } from '../menuItem';
import { MoleculeInterface } from '../../types.ts';
import React from 'react';
import {
  AutoRotateCheckBox,
  AxesCheckBox,
  BackgroundColor,
  ColoringRadioGroup,
  ContainerCheckBox,
  FogCheckBox,
  GlobalStyleRadioGroup,
  MaterialRadioGroup,
  Screenshot,
} from './sharedMenuItems.tsx';
import { RotateLigand, SpaceshipDisplayModeRadioGroup, TranslateLigand } from './drugDiscoveryMenuItems.tsx';

export const createDrugDiscoveryDefaultMenu = (
  pickedMoleculeIndex: number,
  ligand: MoleculeInterface | null,
  protein: MoleculeInterface | null,
) => {
  const lang = { lng: useStore.getState().language };

  const items: MenuProps['items'] = [];

  let pickedMolecule = null;
  if (pickedMoleculeIndex === 0) pickedMolecule = protein;
  else if (pickedMoleculeIndex === 1) pickedMolecule = ligand;

  if (pickedMolecule) {
    items.push({
      key: 'molecule-name',
      label: (
        <>
          <MenuItem stayAfterClick={false} hasPadding={false} fontWeight={'bold'} cursor={'default'}>
            {pickedMolecule.name}
          </MenuItem>
          <hr />
        </>
      ),
    });

    if (pickedMolecule === ligand) {
      items.push({
        key: 'translate-ligand-submenu',
        label: (
          <MenuItem stayAfterClick={true} hasPadding={false}>
            {i18n.t('molecularViewer.TranslateMolecule', lang)}
          </MenuItem>
        ),
        children: [
          {
            key: 'translate-ligand-fields',
            label: <TranslateLigand />,
          },
        ],
      });

      items.push({
        key: 'rotate-molecule-submenu',
        label: (
          <MenuItem stayAfterClick={true} hasPadding={false}>
            {i18n.t('molecularViewer.RotateMolecule', lang)}
          </MenuItem>
        ),
        children: [
          {
            key: 'rotate-ligand-fields',
            label: <RotateLigand />,
          },
        ],
      });
    } else {
      items.push({
        key: 'molecular-viewer-style-submenu',
        label: <MenuItem hasPadding={false}>{i18n.t('molecularViewer.Style', lang)}</MenuItem>,
        children: [
          {
            key: 'molecular-viewer-style-radio-group',
            label: <GlobalStyleRadioGroup />,
          },
        ],
      });

      items.push({
        key: 'molecular-viewer-material-submenu',
        label: <MenuItem hasPadding={false}>{i18n.t('molecularViewer.Material', lang)}</MenuItem>,
        children: [
          {
            key: 'molecular-viewer-material-radio-group',
            label: <MaterialRadioGroup />,
          },
        ],
      });

      items.push({
        key: 'molecular-viewer-coloring-submenu',
        label: <MenuItem hasPadding={false}>{i18n.t('molecularViewer.Color', lang)}</MenuItem>,
        children: [
          {
            key: 'molecular-viewer-coloring-radio-group',
            label: <ColoringRadioGroup />,
          },
        ],
      });
    }
  } else {
    items.push({
      key: 'molecular-viewer-auto-rotate',
      label: <AutoRotateCheckBox />,
    });

    items.push({
      key: 'molecular-viewer-axes',
      label: <AxesCheckBox />,
    });

    items.push({
      key: 'molecular-viewer-container',
      label: <ContainerCheckBox />,
    });

    items.push({
      key: 'molecular-viewer-foggy',
      label: <FogCheckBox />,
    });

    items.push({
      key: 'molecular-viewer-protein-style-submenu',
      label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.ProteinStyle', lang)}</MenuItem>,
      children: [
        {
          key: 'molecular-viewer-protein-style-radio-group',
          label: <GlobalStyleRadioGroup />,
        },
      ],
    });

    items.push({
      key: 'spaceship-display-mode-submenu',
      label: <MenuItem hasPadding={true}>{i18n.t('spaceship.SpaceshipDisplay', lang)}</MenuItem>,
      children: [
        {
          key: 'spaceship-display-mode-radio-group',
          label: <SpaceshipDisplayModeRadioGroup />,
        },
      ],
    });

    items.push({
      key: 'molecular-viewer-background-color',
      label: <BackgroundColor />,
    });

    items.push({
      key: 'molecular-viewer-screenshot',
      label: <Screenshot />,
    });
  }

  return { items } as MenuProps;
};
