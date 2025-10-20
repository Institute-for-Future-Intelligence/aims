/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../../stores/common';
import i18n from '../../i18n/i18n';
import { Space } from 'antd';
import { MainMenuItem, MainSubMenu } from '../menuItem';
import Element from '../../lib/chem/Element';
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
  ColoringRadioSubmenu,
  ContainerCheckBox,
  FogCheckBox,
  GlobalStyleRadioSubmenu,
  MaterialRadioSubmenu,
  NavigationViewCheckBox,
  Screenshot,
  ViewAngleSubmenu,
} from './sharedMenuItems.tsx';
import { useLanguage } from '../../hooks.ts';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import * as Selector from '../../stores/selector';

const MolecularModelingMenu = () => {
  const lang = useLanguage();
  const pickedMoleculeIndex = usePrimitiveStore(Selector.pickedMoleculeIndex);
  const testMolecules = useStore(Selector.testMolecules);
  const pickedAtomIndex = usePrimitiveStore(Selector.pickedAtomIndex);
  const copiedMoleculeIndex = usePrimitiveStore(Selector.copiedMoleculeIndex);
  const cutMolecule = usePrimitiveStore(Selector.cutMolecule);
  const selectedPlane = usePrimitiveStore(Selector.selectedPlane);

  const pickedMolecule = pickedMoleculeIndex !== -1 ? testMolecules[pickedMoleculeIndex] : null;

  const atomCoordinates = () => {
    const mdRef = useRefStore.getState().molecularDynamicsRef;
    if (mdRef?.current) {
      const p = mdRef.current.atoms[pickedAtomIndex].position;
      return (
        <MainMenuItem>
          {i18n.t('experiment.AtomicCoordinates', lang) +
            ': (' +
            p.x.toFixed(2) +
            ', ' +
            p.y.toFixed(2) +
            ', ' +
            p.z.toFixed(2) +
            ') Å'}
        </MainMenuItem>
      );
    } else {
      return null;
    }
  };

  const pasteMolecule = () => {
    if (copiedMoleculeIndex !== -1 || cutMolecule) {
      if (selectedPlane !== -1) {
        return (
          <>
            <PasteMolecule />
            <hr style={{ marginLeft: '24px' }} />
          </>
        );
      } else {
        return (
          <>
            <MainMenuItem hasPadding={true}>{i18n.t('message.NoPlaneToPaste', lang)}</MainMenuItem>
            <hr style={{ marginLeft: '24px' }} />
          </>
        );
      }
    }
  };

  if (pickedMolecule) {
    const prop = useStore.getState().getProvidedMolecularProperties(pickedMolecule.name);
    return (
      <>
        <MainMenuItem stayAfterClick={false} hasPadding={false} fontWeight={'bold'}>
          {pickedMolecule.name + (prop?.formula ? ' ' + prop.formula : '') + ' (#' + pickedMoleculeIndex + ')'}
        </MainMenuItem>
        <hr />

        <CopyMolecule />

        <CutMolecule />

        <MainSubMenu label={i18n.t('molecularViewer.TranslateMolecule', lang)}>
          <TranslateMolecule />
        </MainSubMenu>

        <MainSubMenu label={i18n.t('molecularViewer.RotateMolecule', lang)}>
          <RotateMolecule />
        </MainSubMenu>

        <IndividualMoleculeStyleRadioGroup />

        <RestrainMoleculeInputField />
      </>
    );
  } else if (pickedAtomIndex !== -1) {
    const pickedAtom = useStore.getState().getAtomByIndex(pickedAtomIndex);
    if (pickedAtom) {
      return (
        <>
          {/* atom-name */}
          <MainMenuItem fontWeight={'bold'}>
            {Element.getByName(pickedAtom.elementSymbol).fullName + ' (#' + pickedAtomIndex + ')'}
          </MainMenuItem>

          {/* atom-coordinates */}
          {atomCoordinates()}

          {/* atom-mass */}
          <MainMenuItem>
            {i18n.t('experiment.AtomicMass', lang) + ': ' + pickedAtom.mass.toFixed(2) + ' g/mol'}
          </MainMenuItem>

          {/* atom-sigma */}
          <MainMenuItem>
            {i18n.t('experiment.AtomicRadius', lang) + ': ' + pickedAtom.sigma.toFixed(3) + ' Å'}
          </MainMenuItem>
          <hr style={{ marginTop: '10px', marginBottom: '6px' }} />

          {/* atom-fix */}
          <Space style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <TrajectoryCheckBox />
            <FixAtomCheckBox />
          </Space>

          {/* atom-epsilon */}
          <AtomEpsilonInputField />

          {/* atom-charge */}
          <ChargeAtomInputField />

          {/* atom-restraint */}
          <RestrainAtomInputField />

          {/* atom-damp */}
          <DampAtomInputField />
        </>
      );
    } else {
      return null;
    }
  } else {
    return (
      <>
        {/* paste */}
        {pasteMolecule()}

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

        {/* molecular-viewer-style-submenu */}
        <GlobalStyleRadioSubmenu hasPadding />

        {/* molecular-viewer-material-submenu */}
        <MaterialRadioSubmenu hasPadding />

        {/* molecular-viewer-coloring-submenu */}
        <ColoringRadioSubmenu hasPadding />

        {/* molecular-viewer-background-color */}
        <BackgroundColor />

        {/* molecular-viewer-screenshot */}
        <Screenshot />
      </>
    );
  }
};

export default MolecularModelingMenu;
