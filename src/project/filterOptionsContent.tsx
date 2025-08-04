/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Button, Checkbox } from 'antd';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { useTranslation } from 'react-i18next';
import { UndoableCheck } from '../undo/UndoableCheck.ts';
import { ProjectUtil } from './ProjectUtil.ts';

const FilterOptionsContent = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const addUndoable = useStore(Selector.addUndoable);
  const hiddenProperties = useStore(Selector.hiddenProperties);
  const enableFilters = !!useStore(Selector.enableFilters);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <div>
      <Checkbox
        style={{ width: '100%' }}
        onChange={(e) => {
          setCommonStore((state) => {
            state.projectState.enableFilters = e.target.checked;
            if (state.projectState.enableFilters) {
              if (state.projectState.filters) {
                for (const m of state.projectState.molecules) {
                  const p = state.molecularPropertiesMap.get(m.name);
                  if (p) {
                    m.excluded = ProjectUtil.isExcluded(state.projectState.filters, p, hiddenProperties ?? []);
                  }
                }
              }
            } else {
              for (const m of state.projectState.molecules) {
                m.excluded = false;
              }
            }
          });
          setChanged(true);
        }}
        checked={enableFilters}
      >
        <span style={{ fontSize: '12px' }}>{t('projectPanel.EnableFilters', lang)}</span>
      </Checkbox>
      {enableFilters && (
        <>
          <br />
          <Button style={{ width: '100%', border: 'none', paddingLeft: '24px' }} onClick={() => {}}>
            <span style={{ fontSize: '12px' }} title={t('tooltip.bondCount', lang)}>
              {t('projectPanel.SetMinimumFiltersToPassAllData', lang)}
            </span>
          </Button>
        </>
      )}
    </div>
  );
});

export default FilterOptionsContent;
