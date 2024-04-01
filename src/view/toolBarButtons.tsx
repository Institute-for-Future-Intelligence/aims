/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { ClearOutlined, QuestionCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { FloatButton, InputNumber, Modal, Popover } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { ProjectType } from '../constants.ts';

const ToolBarButtons = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
  const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
  const xzPlaneVisible = useStore(Selector.xzPlaneVisible);
  const xyPlanePosition = useStore(Selector.xyPlanePosition);
  const yzPlanePosition = useStore(Selector.yzPlanePosition);
  const xzPlanePosition = useStore(Selector.xzPlanePosition);
  const projectType = useStore(Selector.projectType);
  const deleteAllAtoms = useStore(Selector.delteAllAtoms);
  const testMolecules = useStore(Selector.testMolecules);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <FloatButton.Group
      shape="square"
      style={{
        position: 'absolute',
        top: '64px',
        left: '6px',
        userSelect: 'none',
        zIndex: 13,
      }}
    >
      <Popover
        placement={'right'}
        content={
          xyPlaneVisible ? (
            <InputNumber
              style={{ width: '120px' }}
              addonBefore={'Z'}
              value={xyPlanePosition}
              step={0.1}
              precision={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.xyPlanePosition = value;
                });
              }}
            />
          ) : undefined
        }
      >
        <FloatButton
          shape="square"
          description={'X-Y'}
          tooltip={xyPlaneVisible ? undefined : t('experiment.ShowXYPlane', lang)}
          style={{ background: xyPlaneVisible ? 'lightgray' : 'white' }}
          onClick={() => {
            setCommonStore((state) => {
              state.projectState.xyPlaneVisible = !state.projectState.xyPlaneVisible;
            });
          }}
          // the following disables keyboard focus
          onMouseDown={(e) => e.preventDefault()}
          // the following disables the context menu
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      </Popover>
      <Popover
        placement={'right'}
        content={
          yzPlaneVisible ? (
            <InputNumber
              style={{ width: '120px' }}
              addonBefore={'X'}
              value={yzPlanePosition}
              step={0.1}
              precision={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.yzPlanePosition = value;
                });
              }}
            />
          ) : undefined
        }
      >
        <FloatButton
          shape="square"
          description={'Y-Z'}
          tooltip={yzPlaneVisible ? undefined : t('experiment.ShowYZPlane', lang)}
          style={{ background: yzPlaneVisible ? 'lightgray' : 'white' }}
          onClick={() => {
            setCommonStore((state) => {
              state.projectState.yzPlaneVisible = !state.projectState.yzPlaneVisible;
            });
          }}
          // the following disables keyboard focus
          onMouseDown={(e) => e.preventDefault()}
          // the following disables the context menu
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      </Popover>
      <Popover
        placement={'right'}
        content={
          xzPlaneVisible ? (
            <InputNumber
              style={{ width: '120px' }}
              addonBefore={'Y'}
              value={xzPlanePosition}
              step={0.1}
              precision={1}
              onChange={(value) => {
                if (value === null) return;
                setCommonStore((state) => {
                  state.projectState.xzPlanePosition = value;
                });
              }}
            />
          ) : undefined
        }
      >
        <FloatButton
          shape="square"
          description={'X-Z'}
          tooltip={xzPlaneVisible ? undefined : t('experiment.ShowXZPlane', lang)}
          style={{ background: xzPlaneVisible ? 'lightgray' : 'white' }}
          onClick={() => {
            setCommonStore((state) => {
              state.projectState.xzPlaneVisible = !state.projectState.xzPlaneVisible;
            });
          }}
          // the following disables keyboard focus
          onMouseDown={(e) => e.preventDefault()}
          // the following disables the context menu
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      </Popover>
      {projectType === ProjectType.MOLECULAR_MODELING && (
        <FloatButton
          shape="square"
          icon={<ClearOutlined style={{ color: testMolecules.length === 0 ? 'lightgray' : undefined }} />}
          tooltip={t('experiment.DeleteAllAtoms', lang)}
          onClick={() => {
            if (testMolecules.length === 0) return;
            Modal.confirm({
              title: t('experiment.DoYouReallyWantToDeleteAllAtoms', lang) + '?',
              icon: <QuestionCircleOutlined />,
              okText: t('word.OK', lang),
              cancelText: t('word.Cancel', lang),
              onOk: () => {
                deleteAllAtoms();
              },
            });
          }}
          // the following disables keyboard focus
          onMouseDown={(e) => e.preventDefault()}
          // the following disables the context menu
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        />
      )}
    </FloatButton.Group>
  );
});

export default ToolBarButtons;
