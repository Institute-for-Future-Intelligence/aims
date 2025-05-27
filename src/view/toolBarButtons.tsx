/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { ClearOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { FloatButton, InputNumber, Modal, Popover, Space } from 'antd';
import { useStore } from '../stores/common';
import * as Selector from '../stores/selector';
import { useTranslation } from 'react-i18next';
import { ProjectType } from '../constants.ts';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import { UndoableDeleteAllMoleculesInChamber } from '../undo/UndoableDelete.ts';

const ToolBarButtons = React.memo(() => {
  const setCommonStore = useStore(Selector.set);
  const language = useStore(Selector.language);
  const loggable = useStore(Selector.loggable);
  const logAction = useStore.getState().logAction;
  const addUndoable = useStore(Selector.addUndoable);
  const setChanged = usePrimitiveStore(Selector.setChanged);
  const xyPlaneVisible = useStore(Selector.xyPlaneVisible);
  const yzPlaneVisible = useStore(Selector.yzPlaneVisible);
  const xzPlaneVisible = useStore(Selector.xzPlaneVisible);
  const xyPlanePosition = useStore(Selector.xyPlanePosition);
  const yzPlanePosition = useStore(Selector.yzPlanePosition);
  const xzPlanePosition = useStore(Selector.xzPlanePosition);
  const projectType = useStore(Selector.projectType);
  const deleteAllAtoms = useStore(Selector.deleteAllAtoms);
  const testMolecules = useStore(Selector.testMolecules);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const removeAllMolecules = () => {
    const undoable = {
      name: 'Delete All Atoms',
      timestamp: Date.now(),
      molecules: [...testMolecules],
      undo: () => {
        setCommonStore((state) => {
          state.projectState.testMolecules = undoable.molecules ?? [];
        });
      },
      redo: () => {
        deleteAllAtoms();
      },
    } as UndoableDeleteAllMoleculesInChamber;
    addUndoable(undoable);
    deleteAllAtoms();
    if (loggable) logAction('Delete All Atoms');
  };

  return (
    <Space
      style={{
        position: 'absolute',
        top: '64px',
        left: '0px',
      }}
    >
      <FloatButton.Group
        shape="square"
        style={{
          position: 'relative',
          top: '0px',
          left: '8px',
          userSelect: 'none',
          zIndex: 13,
        }}
      >
        {xyPlaneVisible ? (
          <Popover
            placement={'right'}
            content={
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
                  setChanged(true);
                }}
              />
            }
          >
            <FloatButton
              shape="square"
              description={'X-Y'}
              style={{ background: 'lightgray' }}
              onClick={() => {
                setCommonStore((state) => {
                  state.projectState.xyPlaneVisible = !state.projectState.xyPlaneVisible;
                });
                setChanged(true);
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
        ) : (
          <FloatButton
            shape="square"
            description={'X-Y'}
            tooltip={t('experiment.ShowXYPlane', lang)}
            style={{ background: 'white' }}
            onClick={() => {
              setCommonStore((state) => {
                state.projectState.xyPlaneVisible = !state.projectState.xyPlaneVisible;
              });
              setChanged(true);
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
        {yzPlaneVisible ? (
          <Popover
            placement={'right'}
            content={
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
                  setChanged(true);
                }}
              />
            }
          >
            <FloatButton
              shape="square"
              description={'Y-Z'}
              style={{ background: 'lightgray' }}
              onClick={() => {
                setCommonStore((state) => {
                  state.projectState.yzPlaneVisible = !state.projectState.yzPlaneVisible;
                });
                setChanged(true);
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
        ) : (
          <FloatButton
            shape="square"
            description={'Y-Z'}
            tooltip={t('experiment.ShowYZPlane', lang)}
            style={{ background: 'white' }}
            onClick={() => {
              setCommonStore((state) => {
                state.projectState.yzPlaneVisible = !state.projectState.yzPlaneVisible;
              });
              setChanged(true);
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
        {xzPlaneVisible ? (
          <Popover
            placement={'right'}
            content={
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
                  setChanged(true);
                }}
              />
            }
          >
            <FloatButton
              shape="square"
              description={'X-Z'}
              style={{ background: 'lightgray' }}
              onClick={() => {
                setCommonStore((state) => {
                  state.projectState.xzPlaneVisible = !state.projectState.xzPlaneVisible;
                });
                setChanged(true);
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
        ) : (
          <FloatButton
            shape="square"
            description={'X-Z'}
            tooltip={t('experiment.ShowXZPlane', lang)}
            style={{ background: 'white' }}
            onClick={() => {
              setCommonStore((state) => {
                state.projectState.xzPlaneVisible = !state.projectState.xzPlaneVisible;
              });
              setChanged(true);
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
                  removeAllMolecules();
                  setChanged(true);
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
    </Space>
  );
});

export default ToolBarButtons;
