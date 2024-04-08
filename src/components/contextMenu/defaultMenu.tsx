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
  RotateLigand,
  RotateMolecule,
  Screenshot,
  SpaceshipDisplayModeRadioGroup,
  StyleRadioGroup,
  TranslateLigand,
  TranslateMolecule,
  VdwBondsCheckBox,
  MomentumVectorCheckBox,
  ForceVectorCheckBox,
  TrajectoryCheckBox,
  FixedCheckBox,
} from './defaultMenuItems';
import { ProjectType } from '../../constants.ts';
import { MoleculeInterface } from '../../types.ts';
import { Molecule } from '../../models/Molecule.ts';

export const createDefaultMenu = (
  projectType: ProjectType,
  pickedAtomIndex: number,
  pickedMoleculeIndex: number,
  copiedMoleculeIndex: number,
  cutMolecule: MoleculeInterface | null,
  selectedPlane: number,
  testMolecules: Molecule[],
  ligand: MoleculeInterface | null,
  protein: MoleculeInterface | null,
) => {
  const lang = { lng: useStore.getState().language };

  const items: MenuProps['items'] = [];

  if (projectType === ProjectType.MOLECULAR_MODELING) {
    const pickedMolecule = pickedMoleculeIndex !== -1 ? testMolecules[pickedMoleculeIndex] : null;
    if (pickedMolecule) {
      items.push({
        key: 'molecule-name',
        label: (
          <>
            <MenuItem stayAfterClick={false} hasPadding={false} fontWeight={'bold'} cursor={'default'}>
              {pickedMolecule.name + ' (#' + pickedMoleculeIndex + ')'}
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
    } else if (pickedAtomIndex !== -1) {
      const pickedAtom = useStore.getState().getAtomByIndex(pickedAtomIndex);
      if (pickedAtom) {
        items.push({
          key: 'atom-name',
          label: (
            <>
              <MenuItem stayAfterClick={false} hasPadding={false} fontWeight={'bold'} cursor={'default'}>
                {pickedAtom.elementSymbol + ' (#' + pickedAtomIndex + ')'}
              </MenuItem>
              <hr />
            </>
          ),
        });

        items.push({
          key: 'atom-mass',
          label: (
            <>
              <MenuItem stayAfterClick={false} hasPadding={true}>
                {i18n.t('experiment.AtomicMass', lang) + ': ' + pickedAtom.mass.toFixed(2)}
              </MenuItem>
            </>
          ),
        });

        items.push({
          key: 'atom-sigma',
          label: (
            <>
              <MenuItem stayAfterClick={false} hasPadding={true}>
                {'σ: ' + pickedAtom.sigma.toFixed(3)}
              </MenuItem>
            </>
          ),
        });

        items.push({
          key: 'atom-epsilon',
          label: (
            <>
              <MenuItem stayAfterClick={false} hasPadding={true}>
                {'ε: ' + pickedAtom.epsilon.toFixed(3)}
              </MenuItem>
            </>
          ),
        });

        items.push({
          key: 'atom-charge',
          label: (
            <>
              <MenuItem stayAfterClick={false} hasPadding={true}>
                {i18n.t('experiment.ElectricCharge', lang) + ': ' + pickedAtom.charge.toPrecision(2)}
              </MenuItem>
            </>
          ),
        });

        items.push({
          key: 'atom-damp',
          label: (
            <>
              <MenuItem stayAfterClick={false} hasPadding={true}>
                {i18n.t('experiment.DampingCoefficient', lang) + ': ' + pickedAtom.damp.toPrecision(2)}
              </MenuItem>
            </>
          ),
        });

        items.push({
          key: 'atom-fix',
          label: <FixedCheckBox />,
        });

        items.push({
          key: 'atom-trajectory',
          label: <TrajectoryCheckBox />,
        });
      }
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
        key: 'molecular-viewer-foggy',
        label: <FogCheckBox />,
      });

      items.push({
        key: 'molecular-viewer-mechanics-submenu',
        label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Mechanics', lang)}</MenuItem>,
        children: [
          {
            key: 'molecular-viewer-vdw-bonds',
            label: <VdwBondsCheckBox />,
            style: { backgroundColor: 'white' },
          },
          {
            key: 'molecular-viewer-momentum-vectors',
            label: <MomentumVectorCheckBox />,
          },
          {
            key: 'molecular-viewer-force-vectors',
            label: <ForceVectorCheckBox />,
          },
        ],
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
