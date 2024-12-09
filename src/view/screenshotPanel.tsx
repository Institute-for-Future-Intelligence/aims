/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks.ts';
import { Button, Space } from 'antd';
import React from 'react';
import { screenshot, showError } from '../helpers.tsx';

export const ScreenshotPanel = React.memo(() => {
  const loggable = useStore(Selector.loggable);
  const logAction = useStore(Selector.logAction);
  const { t } = useTranslation();
  const lang = useLanguage();

  return (
    <Space direction={'horizontal'} style={{ width: '280px' }} onClick={(e) => e.stopPropagation()}>
      <Button
        onClick={() => {
          screenshot('reaction-chamber')
            .then(() => {
              if (loggable) logAction('Take Screenshot of Reaction Chamber');
            })
            .catch((reason) => {
              showError(reason);
            });
        }}
      >
        {t('experiment.ReactionChamber', lang)}
      </Button>
      <Button
        onClick={() => {
          screenshot('whole-app')
            .then(() => {
              if (loggable) logAction('Take Screenshot of Whole App');
            })
            .catch((reason) => {
              showError(reason);
            });
        }}
      >
        {t('experiment.WholeApp', lang)}
      </Button>
    </Space>
  );
});

export default ScreenshotPanel;
