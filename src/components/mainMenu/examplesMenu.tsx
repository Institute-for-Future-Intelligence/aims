/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */
import { MenuProps } from 'antd';
import { MenuItem } from '../menuItem.tsx';
import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common.ts';
import { ProjectState } from '../../types.ts';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { fetchProject } from '../../cloudProjectUtil.ts';
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
    useDataStore.getState().positionTimeSeriesMap.clear();
  };

  const loadProject = (title: string) => {
    const owner = import.meta.env.VITE_EXAMPLE_PROJECT_OWNER;
    if (title && owner) {
      setWaiting(true);
      fetchProject(owner, title, setProjectState).finally(() => {
        setWaiting(false);
      });
      if (useStore.getState().loggable) {
        setCommonStore((state) => {
          state.actionInfo = {
            name: 'Open Example: ' + title,
            timestamp: new Date().getTime(),
          };
        });
      }
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
          key: 'Cis–Trans Isomerism of Fatty Acids',
          label: (
            <MenuItem onClick={() => loadProject('Cis–Trans Isomerism of Fatty Acids')}>
              {i18n.t('menu.examples.chemistry.CisTransIsomerismOfFattyAcids', lang)}
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
  ];

  return items;
};
