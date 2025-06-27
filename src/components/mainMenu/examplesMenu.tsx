/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */
import { MenuProps } from 'antd';
import { MenuItem } from '../menuItem.tsx';
import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common.ts';
import { ProjectState } from '../../types.ts';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { fetchProject, postFetch } from '../../cloudProjectUtil.ts';
import { HOME_URL } from '../../constants.ts';
import { useDataStore } from '../../stores/commonData.ts';

export const createExamplesMenu = (viewOnly: boolean) => {
  const setCommonStore = useStore.getState().set;
  const lang = { lng: useStore.getState().language };
  const setWaiting = usePrimitiveStore.getState().setWaiting;

  const setProjectState = (projectState: ProjectState) => {
    setCommonStore((state) => {
      state.projectState = { ...projectState };
    });
    usePrimitiveStore.getState().set((state) => {
      state.updateProjectsFlag = true;
      state.changed = false;
      state.resetSimulation = true;
    });
    useDataStore.getState().energyTimeSeries.clear();
    useDataStore.getState().speedArrayMap.clear();
    useDataStore.getState().positionTimeSeriesMap.clear();
  };

  const loadProject = (title: string) => {
    const owner = import.meta.env.VITE_EXAMPLE_PROJECT_OWNER;
    if (title && owner) {
      setWaiting(true);
      fetchProject(owner, title, setProjectState).finally(() => {
        setWaiting(false);
        postFetch();
      });
      if (useStore.getState().loggable) useStore.getState().logAction('Open Example: ' + title);
      if (!viewOnly) {
        window.history.pushState({}, document.title, HOME_URL);
      }
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'chemistry',
      label: <MenuItem>{i18n.t('menu.examples.chemistrySubMenu', lang)}</MenuItem>,
      children: [
        {
          key: 'Monatomic Molecules',
          label: (
            <MenuItem onClick={() => loadProject('Monatomic Molecules')}>
              {i18n.t('menu.examples.chemistry.MonatomicMolecules', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Maxwell-Boltzmann Speed Distribution of Argon',
          label: (
            <MenuItem onClick={() => loadProject('Maxwell-Boltzmann Speed Distribution of Argon')}>
              {i18n.t('menu.examples.chemistry.MaxwellBoltzmannSpeedDistributionArgon', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Speed Distributions of Carbon and Hydrogen Atoms in Molecules',
          label: (
            <MenuItem onClick={() => loadProject('Speed Distributions of Carbon and Hydrogen Atoms in Molecules')}>
              {i18n.t('menu.examples.chemistry.SpeedDistributionsOfCarbonAndHydrogenInMolecules', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Diatomic Molecules',
          label: (
            <MenuItem onClick={() => loadProject('Diatomic Molecules')}>
              {i18n.t('menu.examples.chemistry.DiatomicMolecules', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Triatomic Molecules',
          label: (
            <MenuItem onClick={() => loadProject('Triatomic Molecules')}>
              {i18n.t('menu.examples.chemistry.TriatomicMolecules', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Liquid in a Box',
          label: (
            <MenuItem onClick={() => loadProject('Liquid in a Box')}>
              {i18n.t('menu.examples.chemistry.LiquidInBox', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Solid vs. Gas',
          label: (
            <MenuItem onClick={() => loadProject('Solid vs Gas')}>
              {i18n.t('menu.examples.chemistry.SolidVsGas', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Linear Alkanes',
          label: (
            <MenuItem onClick={() => loadProject('Alkanes')}>
              {i18n.t('menu.examples.chemistry.LinearAlkanes', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Cycloalkanes',
          label: (
            <MenuItem onClick={() => loadProject('Cycloalkanes')}>
              {i18n.t('menu.examples.chemistry.Cycloalkanes', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Acenes',
          label: (
            <MenuItem onClick={() => loadProject('Acenes')}>{i18n.t('menu.examples.chemistry.Acenes', lang)}</MenuItem>
          ),
        },
        {
          key: 'Bu-2-ene Isomers',
          label: (
            <MenuItem onClick={() => loadProject('Bu-2-ene Isomers')}>
              {i18n.t('menu.examples.chemistry.Bu2EneIsomers', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'C₈H₁₈O Isomers',
          label: (
            <MenuItem onClick={() => loadProject('C₈H₁₈O Isomers')}>
              {i18n.t('menu.examples.chemistry.C8H18OIsomers', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Cis–Trans Isomerism of Fatty Acids',
          label: (
            <MenuItem onClick={() => loadProject('Cis–Trans Isomerism of Fatty Acids')}>
              {i18n.t('menu.examples.chemistry.CisTransIsomerismOfFattyAcids', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'PFAS',
          label: (
            <MenuItem onClick={() => loadProject('PFAS')}>
              {i18n.t('menu.examples.chemistry.ForeverChemicals', lang)}
            </MenuItem>
          ),
        },
      ],
    },
    {
      key: 'biology',
      label: <MenuItem>{i18n.t('menu.examples.biologySubMenu', lang)}</MenuItem>,
      children: [
        {
          key: 'Protein Alpha Helix',
          label: (
            <MenuItem onClick={() => loadProject('Alpha Helix')}>
              {i18n.t('menu.examples.biology.ProteinAlphaHelix', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'DNA Double Helix',
          label: (
            <MenuItem onClick={() => loadProject('DNA Double Helix')}>
              {i18n.t('menu.examples.biology.DNADoubleHelix', lang)}
            </MenuItem>
          ),
        },
      ],
    },
    {
      key: 'materials-science',
      label: <MenuItem>{i18n.t('menu.examples.materialsScienceSubMenu', lang)}</MenuItem>,
      children: [
        {
          key: 'Gold Crystal',
          label: (
            <MenuItem onClick={() => loadProject('Gold Crystal')}>
              {i18n.t('menu.examples.materialsScience.GoldCrystal', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Silver Crystal',
          label: (
            <MenuItem onClick={() => loadProject('Silver Crystal')}>
              {i18n.t('menu.examples.materialsScience.SilverCrystal', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Iron Crystal',
          label: (
            <MenuItem onClick={() => loadProject('Iron Crystal')}>
              {i18n.t('menu.examples.materialsScience.IronCrystal', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Salt Crystal',
          label: (
            <MenuItem onClick={() => loadProject('Salt Crystal')}>
              {i18n.t('menu.examples.materialsScience.SaltCrystal', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Diamond Crystal',
          label: (
            <MenuItem onClick={() => loadProject('Diamond')}>
              {i18n.t('menu.examples.materialsScience.DiamondCrystal', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Graphite',
          label: (
            <MenuItem onClick={() => loadProject('Graphite')}>
              {i18n.t('menu.examples.materialsScience.Graphite', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Graphenes',
          label: (
            <MenuItem onClick={() => loadProject('Graphenes')}>
              {i18n.t('menu.examples.materialsScience.Graphenes', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Zeolite',
          label: (
            <MenuItem onClick={() => loadProject('Zeolite')}>
              {i18n.t('menu.examples.materialsScience.Zeolite', lang)}
            </MenuItem>
          ),
        },
      ],
    },
    {
      key: 'nanotechnology',
      label: <MenuItem>{i18n.t('menu.examples.nanotechnologySubMenu', lang)}</MenuItem>,
      children: [
        {
          key: 'Buckyballs',
          label: (
            <MenuItem onClick={() => loadProject('Buckyballs')}>
              {i18n.t('menu.examples.nanotechnology.Buckyballs', lang)}
            </MenuItem>
          ),
        },
        {
          key: 'Carbon Nanotube',
          label: (
            <MenuItem onClick={() => loadProject('Water Molecules in a Carbon Nanotube')}>
              {i18n.t('menu.examples.nanotechnology.CarbonNanotube', lang)}
            </MenuItem>
          ),
        },
      ],
    },
    {
      key: 'biotechnology',
      label: <MenuItem>{i18n.t('menu.examples.biotechnologySubMenu', lang)}</MenuItem>,
      children: [
        {
          key: 'HIV-1 Protease Inhibitor',
          label: (
            <MenuItem onClick={() => loadProject('HIV-1 Protease Inhibitor')}>
              {i18n.t('menu.examples.biotechnology.HIV1ProteaseInhibitor', lang)}
            </MenuItem>
          ),
        },
      ],
    },
  ];

  return items;
};
