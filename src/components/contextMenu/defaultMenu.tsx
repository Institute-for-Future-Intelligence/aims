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
  EnergyGraphCheckBox,
  FogCheckBox,
  MaterialRadioGroup,
  PasteMolecule,
  RotateLigand,
  RotateMolecule,
  Screenshot,
  SpaceshipDisplayModeRadioGroup,
  StyleRadioGroup,
  TranslateLigand,
  TranslateMolecule,
  VdwBondsCheckBox,
} from './defaultMenuItems';
import { ProjectType } from '../../constants.ts';
import { MoleculeData } from '../../types.ts';

export const createDefaultMenu = (
  projectType: ProjectType,
  pickedMoleculeIndex: number,
  copiedMoleculeIndex: number,
  cutMolecule: MoleculeData | null,
  selectedPlane: number,
) => {
  const lang = { lng: useStore.getState().language };
  const testMolecules = useStore.getState().projectState.testMolecules;
  const ligand = useStore.getState().projectState.ligand;
  const protein = useStore.getState().projectState.protein;

  const items: MenuProps['items'] = [];

  if (projectType === ProjectType.MOLECULAR_MODELING) {
    const pickedMolecule = pickedMoleculeIndex !== -1 ? testMolecules[pickedMoleculeIndex] : null;
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

      items.push({
        key: 'rotate-molecule-submenu',
        label: (
          <MenuItem stayAfterClick={true} hasPadding={false}>
            {i18n.t('molecularViewer.RotateMolecule', lang)}
          </MenuItem>
        ),
        children: [
          {
            key: 'rotate-molecule-fields',
            label: <RotateMolecule />,
            style: { backgroundColor: 'white' },
          },
        ],
      });
    } else {
      if ((copiedMoleculeIndex !== -1 || cutMolecule) && selectedPlane !== -1) {
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
        key: 'molecular-viewer-vdw-bonds',
        label: <VdwBondsCheckBox />,
      });

      items.push({
        key: 'molecular-viewer-energy-graph',
        label: <EnergyGraphCheckBox />,
      });

      items.push({
        key: 'molecular-viewer-foggy',
        label: <FogCheckBox />,
      });

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
  } else if (projectType === ProjectType.DRUG_DISCOVERY) {
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
              style: { backgroundColor: 'white' },
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
              style: { backgroundColor: 'white' },
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
              label: <StyleRadioGroup />,
              style: { backgroundColor: 'white' },
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
              style: { backgroundColor: 'white' },
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
              style: { backgroundColor: 'white' },
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

      items.push({
        key: 'molecular-viewer-background-color',
        label: <BackgroundColor />,
      });

      items.push({
        key: 'molecular-viewer-screenshot',
        label: <Screenshot />,
      });
    }
  }

  return { items } as MenuProps;
};
