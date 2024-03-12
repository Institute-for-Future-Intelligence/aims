/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import i18n from '../../i18n/i18n';
import type { MenuProps } from 'antd';
import { MenuItem } from '../menuItem';
import {
  AutoRotateCheckBox,
  AxesCheckBox,
  BackgroundColor,
  ColoringRadioGroup,
  ContainerCheckBox,
  CopyMolecule,
  CutMolecule,
  FogCheckBox,
  MaterialRadioGroup,
  PasteMolecule,
  Screenshot,
  SpaceshipDisplayModeRadioGroup,
  StyleRadioGroup,
  TranslateMolecule,
} from './defaultMenuItems';
import { ProjectType } from '../../constants.ts';
import { MoleculeData } from '../../types.ts';

export const createDefaultMenu = (
  pickedMoleculeIndex: number,
  copiedMolecule: MoleculeData | null,
  selectedPlane: number,
) => {
  const lang = { lng: useStore.getState().language };
  const projectType = useStore.getState().projectState.type;
  const testMolecules = useStore.getState().projectState.testMolecules;

  const pickedMolecule = pickedMoleculeIndex !== -1 ? testMolecules[pickedMoleculeIndex] : null;

  const items: MenuProps['items'] = [];

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

    items.push({
      key: 'molecule-copy',
      label: <CopyMolecule />,
    });

    items.push({
      key: 'molecule-cut',
      label: <CutMolecule />,
    });

    items.push({
      key: 'translate-molecule-submenu',
      label: (
        <MenuItem stayAfterClick={true} hasPadding={false}>
          {i18n.t('molecularViewer.TranslateMolecule', lang)}
        </MenuItem>
      ),
      children: [
        {
          key: 'translate-molecule-fields',
          label: <TranslateMolecule />,
          style: { backgroundColor: 'white' },
        },
      ],
    });
  } else {
    if (copiedMolecule && selectedPlane !== -1) {
      items.push({
        key: 'molecule-paste',
        label: (
          <>
            <PasteMolecule />
            <hr style={{ marginLeft: '24px' }} />
          </>
        ),
      });
    }

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

    if (projectType === ProjectType.DRUG_DISCOVERY) {
      items.push({
        key: 'spaceship-display-mode-submenu',
        label: <MenuItem hasPadding={true}>{i18n.t('spaceship.SpaceshipDisplay', lang)}</MenuItem>,
        children: [
          {
            key: 'spaceship-display-mode-radio-group',
            label: <SpaceshipDisplayModeRadioGroup />,
            style: { backgroundColor: 'white' },
          },
        ],
      });
    }

    items.push({
      key: 'molecular-viewer-style-submenu',
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
      key: 'molecular-viewer-material-submenu',
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
      key: 'molecular-viewer-coloring-submenu',
      label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Color', lang)}</MenuItem>,
      children: [
        {
          key: 'molecular-viewer-coloring-radio-group',
          label: <ColoringRadioGroup />,
          style: { backgroundColor: 'white' },
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
