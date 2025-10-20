/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */
import { MenuProps } from 'antd';
import { MainMenuItem, MainSubMenu } from '../menuItem.tsx';
import i18n from '../../i18n/i18n';
import { useStore } from '../../stores/common.ts';
import { ProjectState } from '../../types.ts';
import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import { fetchProject, postFetch } from '../../cloudProjectUtil.ts';
import { HOME_URL } from '../../constants.ts';
import { useDataStore } from '../../stores/commonData.ts';
import { t } from 'i18next';
import { useLanguage } from '../../hooks.ts';

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
      label: <MainMenuItem>{i18n.t('menu.examples.chemistrySubMenu', lang)}</MainMenuItem>,
      children: [
        {
          key: 'Monatomic Molecules',
          label: (
            <MainMenuItem onClick={() => loadProject('Monatomic Molecules')}>
              {i18n.t('menu.examples.chemistry.MonatomicMolecules', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Maxwell-Boltzmann Speed Distribution of Argon',
          label: (
            <MainMenuItem onClick={() => loadProject('Maxwell-Boltzmann Speed Distribution of Argon')}>
              {i18n.t('menu.examples.chemistry.MaxwellBoltzmannSpeedDistributionArgon', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Speed Distributions of Carbon and Hydrogen Atoms in Molecules',
          label: (
            <MainMenuItem onClick={() => loadProject('Speed Distributions of Carbon and Hydrogen Atoms in Molecules')}>
              {i18n.t('menu.examples.chemistry.SpeedDistributionsOfCarbonAndHydrogenInMolecules', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Diatomic Molecules',
          label: (
            <MainMenuItem onClick={() => loadProject('Diatomic Molecules')}>
              {i18n.t('menu.examples.chemistry.DiatomicMolecules', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Triatomic Molecules',
          label: (
            <MainMenuItem onClick={() => loadProject('Triatomic Molecules')}>
              {i18n.t('menu.examples.chemistry.TriatomicMolecules', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Liquid in a Box',
          label: (
            <MainMenuItem onClick={() => loadProject('Liquid in a Box')}>
              {i18n.t('menu.examples.chemistry.LiquidInBox', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Solid vs. Gas',
          label: (
            <MainMenuItem onClick={() => loadProject('Solid vs Gas')}>
              {i18n.t('menu.examples.chemistry.SolidVsGas', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Linear Alkanes',
          label: (
            <MainMenuItem onClick={() => loadProject('Alkanes')}>
              {i18n.t('menu.examples.chemistry.LinearAlkanes', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Cycloalkanes',
          label: (
            <MainMenuItem onClick={() => loadProject('Cycloalkanes')}>
              {i18n.t('menu.examples.chemistry.Cycloalkanes', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Acenes',
          label: (
            <MainMenuItem onClick={() => loadProject('Acenes')}>
              {i18n.t('menu.examples.chemistry.Acenes', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Chlorobenzenes',
          label: (
            <MainMenuItem onClick={() => loadProject('Chlorobenzenes')}>
              {i18n.t('menu.examples.chemistry.Chlorobenzenes', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Bu-2-ene Isomers',
          label: (
            <MainMenuItem onClick={() => loadProject('Bu-2-ene Isomers')}>
              {i18n.t('menu.examples.chemistry.Bu2EneIsomers', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Enantiomers - Arketamine vs Esketamine',
          label: (
            <MainMenuItem onClick={() => loadProject('Enantiomers - Arketamine vs Esketamine')}>
              {i18n.t('menu.examples.chemistry.ArketamineVsEsketamine', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'C₈H₁₈O Isomers',
          label: (
            <MainMenuItem onClick={() => loadProject('C₈H₁₈O Isomers')}>
              {i18n.t('menu.examples.chemistry.C8H18OIsomers', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Cis–Trans Isomerism of Fatty Acids',
          label: (
            <MainMenuItem onClick={() => loadProject('Cis–Trans Isomerism of Fatty Acids')}>
              {i18n.t('menu.examples.chemistry.CisTransIsomerismOfFattyAcids', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'PFAS',
          label: (
            <MainMenuItem onClick={() => loadProject('PFAS')}>
              {i18n.t('menu.examples.chemistry.ForeverChemicals', lang)}
            </MainMenuItem>
          ),
        },
      ],
    },
    {
      key: 'biology',
      label: <MainMenuItem>{i18n.t('menu.examples.biologySubMenu', lang)}</MainMenuItem>,
      children: [
        {
          key: 'Protein Alpha Helix',
          label: (
            <MainMenuItem onClick={() => loadProject('Alpha Helix')}>
              {i18n.t('menu.examples.biology.ProteinAlphaHelix', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'DNA Double Helix',
          label: (
            <MainMenuItem onClick={() => loadProject('DNA Double Helix')}>
              {i18n.t('menu.examples.biology.DNADoubleHelix', lang)}
            </MainMenuItem>
          ),
        },
      ],
    },
    {
      key: 'materials-science',
      label: <MainMenuItem>{i18n.t('menu.examples.materialsScienceSubMenu', lang)}</MainMenuItem>,
      children: [
        {
          key: 'Gold Crystal',
          label: (
            <MainMenuItem onClick={() => loadProject('Gold Crystal')}>
              {i18n.t('menu.examples.materialsScience.GoldCrystal', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Silver Crystal',
          label: (
            <MainMenuItem onClick={() => loadProject('Silver Crystal')}>
              {i18n.t('menu.examples.materialsScience.SilverCrystal', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Iron Crystal',
          label: (
            <MainMenuItem onClick={() => loadProject('Iron Crystal')}>
              {i18n.t('menu.examples.materialsScience.IronCrystal', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Salt Crystal',
          label: (
            <MainMenuItem onClick={() => loadProject('Salt Crystal')}>
              {i18n.t('menu.examples.materialsScience.SaltCrystal', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Diamond Crystal',
          label: (
            <MainMenuItem onClick={() => loadProject('Diamond')}>
              {i18n.t('menu.examples.materialsScience.DiamondCrystal', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Graphite',
          label: (
            <MainMenuItem onClick={() => loadProject('Graphite')}>
              {i18n.t('menu.examples.materialsScience.Graphite', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Graphenes',
          label: (
            <MainMenuItem onClick={() => loadProject('Graphenes')}>
              {i18n.t('menu.examples.materialsScience.Graphenes', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Zeolite',
          label: (
            <MainMenuItem onClick={() => loadProject('Zeolite')}>
              {i18n.t('menu.examples.materialsScience.Zeolite', lang)}
            </MainMenuItem>
          ),
        },
      ],
    },
    {
      key: 'nanotechnology',
      label: <MainMenuItem>{i18n.t('menu.examples.nanotechnologySubMenu', lang)}</MainMenuItem>,
      children: [
        {
          key: 'Buckyballs',
          label: (
            <MainMenuItem onClick={() => loadProject('Buckyballs')}>
              {i18n.t('menu.examples.nanotechnology.Buckyballs', lang)}
            </MainMenuItem>
          ),
        },
        {
          key: 'Carbon Nanotube',
          label: (
            <MainMenuItem onClick={() => loadProject('Water Molecules in a Carbon Nanotube')}>
              {i18n.t('menu.examples.nanotechnology.CarbonNanotube', lang)}
            </MainMenuItem>
          ),
        },
      ],
    },
    {
      key: 'biotechnology',
      label: <MainMenuItem>{i18n.t('menu.examples.biotechnologySubMenu', lang)}</MainMenuItem>,
      children: [
        {
          key: 'HIV-1 Protease Inhibitor',
          label: (
            <MainMenuItem onClick={() => loadProject('HIV-1 Protease Inhibitor')}>
              {i18n.t('menu.examples.biotechnology.HIV1ProteaseInhibitor', lang)}
            </MainMenuItem>
          ),
        },
      ],
    },
  ];

  return items;
};

interface Props {
  viewOnly: boolean;
}

const ExampleMenu = ({ viewOnly }: Props) => {
  const lang = useLanguage();
  const setCommonStore = useStore.getState().set;
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

  return (
    <MainSubMenu label={t('menu.examplesSubMenu', lang)}>
      {/* chemistry */}
      <MainSubMenu label={t('menu.examples.chemistrySubMenu', lang)}>
        {/* Monatomic Molecules */}
        <MainMenuItem onClick={() => loadProject('Monatomic Molecules')}>
          {i18n.t('menu.examples.chemistry.MonatomicMolecules', lang)}
        </MainMenuItem>

        {/* Maxwell-Boltzmann Speed Distribution of Argon */}
        <MainMenuItem onClick={() => loadProject('Maxwell-Boltzmann Speed Distribution of Argon')}>
          {i18n.t('menu.examples.chemistry.MaxwellBoltzmannSpeedDistributionArgon', lang)}
        </MainMenuItem>

        {/* Speed Distributions of Carbon and Hydrogen Atoms in Molecules */}
        <MainMenuItem onClick={() => loadProject('Speed Distributions of Carbon and Hydrogen Atoms in Molecules')}>
          {i18n.t('menu.examples.chemistry.SpeedDistributionsOfCarbonAndHydrogenInMolecules', lang)}
        </MainMenuItem>

        {/* Diatomic Molecules */}
        <MainMenuItem onClick={() => loadProject('Diatomic Molecules')}>
          {i18n.t('menu.examples.chemistry.DiatomicMolecules', lang)}
        </MainMenuItem>

        {/* Triatomic Molecules */}
        <MainMenuItem onClick={() => loadProject('Triatomic Molecules')}>
          {i18n.t('menu.examples.chemistry.TriatomicMolecules', lang)}
        </MainMenuItem>

        {/* Liquid in a Box */}
        <MainMenuItem onClick={() => loadProject('Liquid in a Box')}>
          {i18n.t('menu.examples.chemistry.LiquidInBox', lang)}
        </MainMenuItem>

        {/* Solid vs. Gas */}
        <MainMenuItem onClick={() => loadProject('Solid vs Gas')}>
          {i18n.t('menu.examples.chemistry.SolidVsGas', lang)}
        </MainMenuItem>

        {/* Linear Alkanes */}
        <MainMenuItem onClick={() => loadProject('Alkanes')}>
          {i18n.t('menu.examples.chemistry.LinearAlkanes', lang)}
        </MainMenuItem>

        {/* Cycloalkanes */}
        <MainMenuItem onClick={() => loadProject('Cycloalkanes')}>
          {i18n.t('menu.examples.chemistry.Cycloalkanes', lang)}
        </MainMenuItem>

        {/* Acenes */}
        <MainMenuItem onClick={() => loadProject('Acenes')}>
          {i18n.t('menu.examples.chemistry.Acenes', lang)}
        </MainMenuItem>

        {/* Chlorobenzenes */}
        <MainMenuItem onClick={() => loadProject('Chlorobenzenes')}>
          {i18n.t('menu.examples.chemistry.Chlorobenzenes', lang)}
        </MainMenuItem>

        {/* Bu-2-ene Isomers */}
        <MainMenuItem onClick={() => loadProject('Bu-2-ene Isomers')}>
          {i18n.t('menu.examples.chemistry.Bu2EneIsomers', lang)}
        </MainMenuItem>

        {/* Enantiomers - Arketamine vs Esketamine */}
        <MainMenuItem onClick={() => loadProject('Enantiomers - Arketamine vs Esketamine')}>
          {i18n.t('menu.examples.chemistry.ArketamineVsEsketamine', lang)}
        </MainMenuItem>

        {/* C₈H₁₈O Isomers */}
        <MainMenuItem onClick={() => loadProject('C₈H₁₈O Isomers')}>
          {i18n.t('menu.examples.chemistry.C8H18OIsomers', lang)}
        </MainMenuItem>

        {/* Cis–Trans Isomerism of Fatty Acids */}
        <MainMenuItem onClick={() => loadProject('Cis–Trans Isomerism of Fatty Acids')}>
          {i18n.t('menu.examples.chemistry.CisTransIsomerismOfFattyAcids', lang)}
        </MainMenuItem>

        {/* PFAS */}
        <MainMenuItem onClick={() => loadProject('PFAS')}>
          {i18n.t('menu.examples.chemistry.ForeverChemicals', lang)}
        </MainMenuItem>
      </MainSubMenu>

      {/* biology */}
      <MainSubMenu label={t('menu.examples.biologySubMenu', lang)}>
        {/* 'Protein Alpha Helix', */}
        <MainMenuItem onClick={() => loadProject('Alpha Helix')}>
          {i18n.t('menu.examples.biology.ProteinAlphaHelix', lang)}
        </MainMenuItem>
        {/* 'DNA Double Helix', */}
        <MainMenuItem onClick={() => loadProject('DNA Double Helix')}>
          {i18n.t('menu.examples.biology.DNADoubleHelix', lang)}
        </MainMenuItem>
      </MainSubMenu>

      {/* materials-science */}
      <MainSubMenu label={t('menu.examples.materialsScienceSubMenu', lang)}>
        {/* Gold Crystal */}
        <MainMenuItem onClick={() => loadProject('Gold Crystal')}>
          {i18n.t('menu.examples.materialsScience.GoldCrystal', lang)}
        </MainMenuItem>

        {/* Silver Crystal */}
        <MainMenuItem onClick={() => loadProject('Silver Crystal')}>
          {i18n.t('menu.examples.materialsScience.SilverCrystal', lang)}
        </MainMenuItem>

        {/* Iron Crystal */}
        <MainMenuItem onClick={() => loadProject('Iron Crystal')}>
          {i18n.t('menu.examples.materialsScience.IronCrystal', lang)}
        </MainMenuItem>

        {/* Salt Crystal */}
        <MainMenuItem onClick={() => loadProject('Salt Crystal')}>
          {i18n.t('menu.examples.materialsScience.SaltCrystal', lang)}
        </MainMenuItem>

        {/* Diamond Crystal */}
        <MainMenuItem onClick={() => loadProject('Diamond')}>
          {i18n.t('menu.examples.materialsScience.DiamondCrystal', lang)}
        </MainMenuItem>

        {/* Graphite */}
        <MainMenuItem onClick={() => loadProject('Graphite')}>
          {i18n.t('menu.examples.materialsScience.Graphite', lang)}
        </MainMenuItem>

        {/* Graphenes */}
        <MainMenuItem onClick={() => loadProject('Graphenes')}>
          {i18n.t('menu.examples.materialsScience.Graphenes', lang)}
        </MainMenuItem>

        {/* Zeolite */}
        <MainMenuItem onClick={() => loadProject('Zeolite')}>
          {i18n.t('menu.examples.materialsScience.Zeolite', lang)}
        </MainMenuItem>
      </MainSubMenu>

      {/* nanotechnology */}
      <MainSubMenu label={t('menu.examples.nanotechnologySubMenu', lang)}>
        {/* 'Buckyballs', */}
        <MainMenuItem onClick={() => loadProject('Buckyballs')}>
          {i18n.t('menu.examples.nanotechnology.Buckyballs', lang)}
        </MainMenuItem>
        {/* 'Carbon Nanotube', */}
        <MainMenuItem onClick={() => loadProject('Water Molecules in a Carbon Nanotube')}>
          {i18n.t('menu.examples.nanotechnology.CarbonNanotube', lang)}
        </MainMenuItem>
      </MainSubMenu>

      {/* biotechnology */}
      <MainSubMenu label={t('menu.examples.biotechnologySubMenu', lang)}>
        {/* HIV-1 Protease Inhibitor */}
        <MainMenuItem onClick={() => loadProject('HIV-1 Protease Inhibitor')}>
          {i18n.t('menu.examples.biotechnology.HIV1ProteaseInhibitor', lang)}
        </MainMenuItem>
      </MainSubMenu>
    </MainSubMenu>
  );
};

export default ExampleMenu;
