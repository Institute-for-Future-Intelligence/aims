/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo, useRef, useState } from 'react';
import { Button, Col, Input, Modal, Row, Select } from 'antd';
import Draggable, { DraggableBounds, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from '../../stores/common';
import * as Selector from '../../stores/selector';
import { usePrimitiveStore } from '../../stores/commonPrimitive';
import { ProjectType } from '../../types';
import { REGEX_ALLOWABLE_IN_NAME } from '../../programmaticConstants';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const NewProjectDialog = ({ saveAs }: { saveAs: boolean }) => {
  const setCommonStore = useStore(Selector.set);
  const loggable = useStore(Selector.loggable);
  const language = useStore(Selector.language);

  const [projectType, setProjectType] = useState<ProjectType>(
    useStore.getState().projectInfo.type ?? ProjectType.DRUG_DISCOVERY,
  );
  const [projectTitle, setProjectTitle] = useState<string | null>(useStore.getState().projectInfo.title);
  const [projectDescription, setProjectDescription] = useState<string | null>(
    useStore.getState().projectInfo.description,
  );
  const [dragEnabled, setDragEnabled] = useState<boolean>(false);
  const [bounds, setBounds] = useState<DraggableBounds>({ left: 0, top: 0, bottom: 0, right: 0 } as DraggableBounds);
  const dragRef = useRef<HTMLDivElement | null>(null);

  const { TextArea } = Input;

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const onStart = (event: DraggableEvent, uiData: DraggableData) => {
    if (dragRef.current) {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = dragRef.current.getBoundingClientRect();
      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect?.bottom - uiData.y),
      });
    }
  };

  const onCancelClick = () => {
    if (saveAs) {
      usePrimitiveStore.getState().setSaveProjectAsDialog(false);
    } else {
      usePrimitiveStore.getState().setCreateProjectDialog(false);
    }
  };

  const onOkClick = () => {
    usePrimitiveStore.getState().set((state) => {
      if (saveAs) {
        state.saveProjectAsFlag = true;
        state.saveProjectAsDialog = false;
      } else {
        state.createProjectFlag = true;
        state.createProjectDialog = false;
      }
      state.projectType = projectType;
      state.projectTitle = projectTitle;
      state.projectDescription = projectDescription;
    });
    if (loggable) {
      setCommonStore((state) => {
        state.actionInfo = {
          name: saveAs ? 'Save Project as' : 'Create New Project',
          timestamp: new Date().getTime(),
        };
      });
    }
  };

  return (
    <Modal
      width={560}
      open={true}
      title={
        <div
          style={{ width: '100%', cursor: 'move' }}
          onMouseOver={() => setDragEnabled(true)}
          onMouseOut={() => setDragEnabled(false)}
        >
          {`${t(saveAs ? 'menu.project.SaveProjectAs' : 'menu.project.CreateNewProject', lang)}`}
        </div>
      }
      footer={[
        <Button key="Cancel" onClick={onCancelClick}>
          {`${t('word.Cancel', lang)}`}
        </Button>,
        <Button key="OK" type="primary" onClick={onOkClick} disabled={!projectTitle}>
          {`${t('word.OK', lang)}`}
        </Button>,
      ]}
      // this must be specified for the x button in the upper-right corner to work
      onCancel={() => {
        if (saveAs) {
          usePrimitiveStore.getState().setSaveProjectAsDialog(false);
        } else {
          usePrimitiveStore.getState().setCreateProjectDialog(false);
        }
      }}
      maskClosable={false}
      destroyOnClose={false}
      modalRender={(modal) => (
        <Draggable disabled={!dragEnabled} bounds={bounds} onStart={(event, uiData) => onStart(event, uiData)}>
          <div ref={dragRef}>{modal}</div>
        </Draggable>
      )}
    >
      <Row gutter={6} style={{ paddingBottom: '4px' }}>
        <Col className="gutter-row" span={8}>
          {t('projectPanel.ProjectType', lang) + ':'}
        </Col>
        <Col className="gutter-row" span={16}>
          <Select
            disabled={saveAs}
            style={{ width: '100%' }}
            value={projectType}
            onChange={(value) => {
              setProjectType(value);
            }}
          >
            <Option key={ProjectType.DRUG_DISCOVERY} value={ProjectType.DRUG_DISCOVERY}>
              {`${t('term.DrugDiscovery', lang)}`}
            </Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={6} style={{ paddingBottom: '4px' }}>
        <Col className="gutter-row" span={8}>
          {`${t('word.Title', lang)}`}:
        </Col>
        <Col className="gutter-row" span={16}>
          <Input
            maxLength={50}
            style={{ width: '100%' }}
            value={projectTitle ?? ''}
            onKeyDown={(e) => {
              if (!REGEX_ALLOWABLE_IN_NAME.test(e.key)) {
                e.preventDefault();
                return false;
              }
            }}
            onChange={(e) => {
              setProjectTitle(e.target.value);
            }}
          />
        </Col>
      </Row>

      <Row gutter={6} style={{ paddingBottom: '4px' }}>
        <Col className="gutter-row" span={8}>
          {`${t('word.Description', lang)}`}:<br />
          <span style={{ fontSize: '10px' }}>({`${t('word.MaximumCharacters', lang)}`}: 200)</span>
        </Col>
        <Col className="gutter-row" span={16}>
          <TextArea
            rows={5}
            maxLength={200}
            style={{ width: '100%' }}
            value={projectDescription ?? ''}
            onChange={(e) => {
              setProjectDescription(e.target.value);
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default React.memo(NewProjectDialog);
