/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { MainSubMenu } from '../menuItem.tsx';
import i18n from '../../i18n/i18n.ts';
import { ResetOrientation, SizeRadioGroup } from './spaceshipMenuItems.tsx';
import { useLanguage } from '../../hooks.ts';

export const SpaceshipMenu = () => {
  const lang = useLanguage();
  return (
    <>
      <ResetOrientation />
      <MainSubMenu label={i18n.t('word.Size', lang)}>
        <SizeRadioGroup />
      </MainSubMenu>
      ,
    </>
  );
};
