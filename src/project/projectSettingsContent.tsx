/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { GraphType, LabelType } from '../constants.ts';
import { useStore } from '../stores/common.ts';
import {
  GALLERY_STYLE_LABELS,
  MATERIAL_LABELS,
  MolecularViewerMaterial,
  MolecularViewerStyle,
} from '../view/displayOptions.ts';
import { Col, ColorPicker, InputNumber, Row, Select } from 'antd';
import { UndoableChange } from '../undo/UndoableChange.ts';
import { useTranslation } from 'react-i18next';
import * as Selector from '../stores/selector';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';

const { Option } = Select;

interface ProjectSettingsContentProps {
  columnCount: number;
  viewerStyle: MolecularViewerStyle;
  viewerMaterial: MolecularViewerMaterial;
  viewerBackground: string;
  labelType: LabelType;
  graphType: GraphType;
}

const ProjectSettingsContent = React.memo(
  ({
    columnCount,
    viewerStyle,
    viewerMaterial,
    viewerBackground,
    labelType,
    graphType,
  }: ProjectSettingsContentProps) => {
    const language = useStore(Selector.language);
    const setChanged = usePrimitiveStore(Selector.setChanged);
    const addUndoable = useStore(Selector.addUndoable);
    const numberOfColumns = useStore(Selector.numberOfColumns);

    const { t } = useTranslation();
    const lang = useMemo(() => {
      return { lng: language };
    }, [language]);

    const setNumberOfColumns = (n: number) => {
      useStore.getState().set((state) => {
        state.projectState.numberOfColumns = n;
      });
      setChanged(true);
    };

    const setGraphType = (graphType: GraphType) => {
      useStore.getState().set((state) => {
        state.projectState.graphType = graphType;
        state.projectState.selectedProperty = null;
      });
      setChanged(true);
    };

    const setLabelType = (labelType: LabelType) => {
      useStore.getState().set((state) => {
        state.projectState.labelType = labelType;
      });
      setChanged(true);
    };

    const setStyle = (style: MolecularViewerStyle) => {
      useStore.getState().set((state) => {
        state.projectState.projectViewerStyle = style;
      });
      setChanged(true);
    };

    const setMaterial = (material: MolecularViewerMaterial) => {
      useStore.getState().set((state) => {
        state.projectState.projectViewerMaterial = material;
      });
      setChanged(true);
    };

    const setBackground = (color: string) => {
      useStore.getState().set((state) => {
        state.projectState.projectViewerBackground = color;
      });
      setChanged(true);
    };

    const setColumnCount = (noc: number) => {
      const undoable = {
        name: 'Set Number of Columns',
        timestamp: Date.now(),
        oldValue: numberOfColumns,
        newValue: noc,
        undo: () => setNumberOfColumns(undoable.oldValue as number),
        redo: () => setNumberOfColumns(undoable.newValue as number),
      } as UndoableChange;
      addUndoable(undoable);
      setNumberOfColumns(noc);
      setChanged(true);
    };

    return (
      <div style={{ width: '320px', paddingTop: '10px' }} onClick={(e) => e.stopPropagation()}>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('projectPanel.NumberOfColumns', lang)}: </span>
          </Col>
          <Col span={14}>
            <InputNumber
              style={{ width: '100%' }}
              min={2}
              max={10}
              step={1}
              value={columnCount}
              onChange={(value) => {
                if (value === null) return;
                setColumnCount(value);
              }}
            />
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('molecularViewer.Style', lang)}: </span>
          </Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={viewerStyle}
              onChange={(value: MolecularViewerStyle) => {
                const oldValue = viewerStyle;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Molecular Viewer Style for Project',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setStyle(undoableChange.oldValue as MolecularViewerStyle);
                  },
                  redo: () => {
                    setStyle(undoableChange.newValue as MolecularViewerStyle);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setStyle(newValue);
              }}
            >
              {GALLERY_STYLE_LABELS.map((radio, idx) => (
                <Option key={`${idx}-${radio.value}`} value={radio.value}>
                  {t(radio.label, lang)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('molecularViewer.Material', lang)}: </span>
          </Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={viewerMaterial}
              onChange={(value: MolecularViewerMaterial) => {
                const oldValue = viewerMaterial;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Molecular Viewer Material for Project',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setMaterial(undoableChange.oldValue as MolecularViewerMaterial);
                  },
                  redo: () => {
                    setMaterial(undoableChange.newValue as MolecularViewerMaterial);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setMaterial(newValue);
              }}
            >
              {MATERIAL_LABELS.map((radio, idx) => (
                <Option key={`${idx}-${radio.value}`} value={radio.value}>
                  {t(radio.label, lang)}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('projectPanel.LabelType', lang)}: </span>
          </Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={labelType}
              onChange={(value: LabelType) => {
                const oldValue = labelType;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Label Type for Project',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setLabelType(undoableChange.oldValue as LabelType);
                  },
                  redo: () => {
                    setLabelType(undoableChange.newValue as LabelType);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setLabelType(newValue);
              }}
            >
              <Option key={LabelType.NAME} value={LabelType.NAME}>
                {t('projectPanel.MolecularName', lang)}
              </Option>
              <Option key={LabelType.FORMULA} value={LabelType.FORMULA}>
                {t('projectPanel.MolecularFormula', lang)}
              </Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('projectPanel.GraphType', lang)}: </span>
          </Col>
          <Col span={14}>
            <Select
              style={{ width: '100%' }}
              value={graphType}
              onChange={(value: GraphType) => {
                const oldValue = graphType;
                const newValue = value;
                const undoableChange = {
                  name: 'Select Graph Type for Project',
                  timestamp: Date.now(),
                  oldValue: oldValue,
                  newValue: newValue,
                  undo: () => {
                    setGraphType(undoableChange.oldValue as GraphType);
                  },
                  redo: () => {
                    setGraphType(undoableChange.newValue as GraphType);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setGraphType(newValue);
              }}
            >
              <Option key={GraphType.PARALLEL_COORDINATES} value={GraphType.PARALLEL_COORDINATES}>
                {t('projectPanel.ParallelCoordinates', lang)}
              </Option>
              <Option key={GraphType.SCATTER_PLOT} value={GraphType.SCATTER_PLOT}>
                {t('projectPanel.ScatterPlot', lang)}
              </Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={6} style={{ paddingBottom: '4px' }}>
          <Col span={10} style={{ paddingTop: '5px' }}>
            <span>{t('molecularViewer.BackgroundColor', lang)}: </span>
          </Col>
          <Col span={14}>
            <ColorPicker
              style={{ width: '100%' }}
              showText={true}
              value={viewerBackground}
              onChange={(value, hex) => {
                const selectedColor = hex;
                const undoableChange = {
                  name: 'Change Background Color for Project Viewers',
                  timestamp: Date.now(),
                  oldValue: viewerBackground,
                  newValue: selectedColor,
                  undo: () => {
                    setBackground(undoableChange.oldValue as string);
                  },
                  redo: () => {
                    setBackground(undoableChange.newValue as string);
                  },
                } as UndoableChange;
                useStore.getState().addUndoable(undoableChange);
                setBackground(selectedColor);
              }}
            />
          </Col>
        </Row>
      </div>
    );
  },
);

export default ProjectSettingsContent;
