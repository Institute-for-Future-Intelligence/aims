/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import i18n from '../../i18n/i18n';
import { MenuProps, Space } from 'antd';
import { MenuItem } from '../menuItem';
import { MoleculeInterface } from '../../types.ts';
import { Molecule } from '../../models/Molecule.ts';
import Element from '../../lib/chem/Element';
import React from 'react';
import { useRefStore } from '../../stores/commonRef.ts';
import {
  AngularBondsCheckBox,
  AtomEpsilonInputField,
  ChargeAtomInputField,
  CopyMolecule,
  CutMolecule,
  DampAtomInputField,
  FixAtomCheckBox,
  ForceVectorCheckBox,
  IndividualMoleculeStyleRadioGroup,
  MomentumVectorCheckBox,
  PasteMolecule,
  RestrainAtomInputField,
  RestrainMoleculeInputField,
  RotateMolecule,
  TorsionalBondsCheckBox,
  TrajectoryCheckBox,
  TranslateMolecule,
  VdwBondsCheckBox,
} from './molecularModelingMenuItems.tsx';
import {
  AutoRotateCheckBox,
  AxesCheckBox,
  BackgroundColor,
  ColoringRadioGroup,
  ContainerCheckBox,
  FogCheckBox,
  GlobalStyleRadioGroup,
  MaterialRadioGroup,
  NavigationViewCheckBox,
  Screenshot,
  ViewAngleMenuItems,
} from './sharedMenuItems.tsx';

export const createMolecularModelingDefaultMenu = (
  pickedAtomIndex: number,
  pickedMoleculeIndex: number,
  copiedMoleculeIndex: number,
  cutMolecule: MoleculeInterface | null,
  selectedPlane: number,
  testMolecules: Molecule[],
) => {
  const lang = { lng: useStore.getState().language };

  const items: MenuProps['items'] = [];

  const pickedMolecule = pickedMoleculeIndex !== -1 ? testMolecules[pickedMoleculeIndex] : null;
  if (pickedMolecule) {
    const prop = useStore.getState().getProvidedMolecularProperties(pickedMolecule.name);
    items.push({
      key: 'molecule-name',
      label: (
        <>
          <MenuItem stayAfterClick={false} hasPadding={false} fontWeight={'bold'} cursor={'default'}>
            {pickedMolecule.name + (prop?.formula ? ' ' + prop.formula : '') + ' (#' + pickedMoleculeIndex + ')'}
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
        },
      ],
    });

    items.push({
      key: 'molecule-style-submenu',
      label: <MenuItem hasPadding={false}>{i18n.t('molecularViewer.Style', lang)}</MenuItem>,
      children: [
        {
          key: 'molecule-style-radio-group',
          label: <IndividualMoleculeStyleRadioGroup />,
        },
      ],
    });

    items.push({
      key: 'molecule-restraint',
      label: <RestrainMoleculeInputField />,
    });
  } else if (pickedAtomIndex !== -1) {
    const pickedAtom = useStore.getState().getAtomByIndex(pickedAtomIndex);
    if (pickedAtom) {
      items.push({
        key: 'atom-name',
        label: (
          <>
            <MenuItem stayAfterClick={false} hasPadding={false} fontWeight={'bold'} cursor={'default'}>
              {Element.getByName(pickedAtom.elementSymbol).fullName + ' (#' + pickedAtomIndex + ')'}
            </MenuItem>
          </>
        ),
      });

      const mdRef = useRefStore.getState().molecularDynamicsRef;
      if (mdRef?.current) {
        const p = mdRef.current.atoms[pickedAtomIndex].position;
        items.push({
          key: 'atom-coordinates',
          label: (
            <>
              <MenuItem stayAfterClick={false} hasPadding={false}>
                {i18n.t('experiment.AtomicCoordinates', lang) +
                  ': (' +
                  p.x.toFixed(2) +
                  ', ' +
                  p.y.toFixed(2) +
                  ', ' +
                  p.z.toFixed(2) +
                  ') Å'}
              </MenuItem>
            </>
          ),
        });
      }

      items.push({
        key: 'atom-mass',
        label: (
          <>
            <MenuItem stayAfterClick={false} hasPadding={false}>
              {i18n.t('experiment.AtomicMass', lang) + ': ' + pickedAtom.mass.toFixed(2) + ' g/mol'}
            </MenuItem>
          </>
        ),
      });

      items.push({
        key: 'atom-sigma',
        label: (
          <>
            <MenuItem stayAfterClick={false} hasPadding={false}>
              {i18n.t('experiment.AtomicRadius', lang) + ': ' + pickedAtom.sigma.toFixed(3) + ' Å'}
            </MenuItem>
            <hr style={{ marginTop: '10px', marginBottom: '6px' }} />
          </>
        ),
      });

      items.push({
        key: 'atom-fix',
        label: (
          <Space>
            <TrajectoryCheckBox />
            <FixAtomCheckBox />
          </Space>
        ),
      });

      items.push({
        key: 'atom-epsilon',
        label: <AtomEpsilonInputField />,
      });

      items.push({
        key: 'atom-charge',
        label: <ChargeAtomInputField />,
      });

      items.push({
        key: 'atom-restraint',
        label: <RestrainAtomInputField />,
      });

      items.push({
        key: 'atom-damp',
        label: <DampAtomInputField />,
      });
    }
  } else {
    if (copiedMoleculeIndex !== -1 || cutMolecule) {
      if (selectedPlane !== -1) {
        items.push({
          key: 'molecule-paste',
          label: (
            <>
              <PasteMolecule />
              <hr style={{ marginLeft: '24px' }} />
            </>
          ),
        });
      } else {
        items.push({
          key: 'molecule-nowhere-to-paste',
          label: (
            <>
              <MenuItem stayAfterClick={false} hasPadding={true}>
                {i18n.t('message.NoPlaneToPaste', lang)}
              </MenuItem>
              <hr style={{ marginLeft: '24px' }} />
            </>
          ),
        });
      }
    }

    items.push({
      key: 'molecular-viewer-auto-rotate',
      label: <AutoRotateCheckBox />,
    });

    items.push({
      key: 'molecular-viewer-navigation-mode',
      label: <NavigationViewCheckBox popup={true} />,
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
      key: 'molecular-viewer-view-angle-submenu',
      label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.ViewDirection', lang)}</MenuItem>,
      children: [
        {
          key: 'molecular-viewer-view-angle-items',
          label: <ViewAngleMenuItems />,
        },
      ],
    });

    items.push({
      key: 'molecular-viewer-mechanics-submenu',
      label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.Mechanics', lang)}</MenuItem>,
      children: [
        {
          key: 'molecular-viewer-vdw-bonds',
          label: <VdwBondsCheckBox />,
        },
        {
          key: 'molecular-viewer-angular-bonds',
          label: <AngularBondsCheckBox />,
        },
        {
          key: 'molecular-viewer-torsional-bonds',
          label: <TorsionalBondsCheckBox />,
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
      label: <MenuItem hasPadding={true}>{i18n.t('molecularViewer.GlobalStyle', lang)}</MenuItem>,
      children: [
        {
          key: 'molecular-viewer-style-radio-group',
          label: <GlobalStyleRadioGroup />,
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
