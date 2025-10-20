/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from '../../stores/commonPrimitive.ts';
import * as Selector from '../../stores/selector';
import { useLanguage } from '../../hooks.ts';
import { LabelMark, MainMenuItem } from '../menuItem.tsx';
import i18n from '../../i18n/i18n.ts';
import NewProjectDialog from './newProjectDialog.tsx';

export const SaveProjectAsItem = ({ isMac, saveProjectAs }: { isMac: boolean; saveProjectAs: () => void }) => {
  const saveProjectDialog = usePrimitiveStore(Selector.saveProjectAsDialog);
  const lang = useLanguage();

  return (
    <>
      <MainMenuItem onClick={() => saveProjectAs()}>
        {i18n.t('menu.project.SaveProjectAs', lang)}
        <LabelMark>({isMac ? '⌘' : 'Ctrl'}+Shift+S)</LabelMark>...
      </MainMenuItem>
      {saveProjectDialog && <NewProjectDialog saveAs={true} />}
    </>
  );
};
