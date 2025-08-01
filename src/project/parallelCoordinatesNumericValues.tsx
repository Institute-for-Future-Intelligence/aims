/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Table, Typography } from 'antd';
import Column from 'antd/lib/table/Column';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { ProjectUtil } from './ProjectUtil.ts';
import { useTranslation } from 'react-i18next';
import { DatumEntry } from '../types.ts';
import { saveAs } from 'file-saver';
import { usePrimitiveStore } from '../stores/commonPrimitive.ts';

interface ParallelCoordinatesNumericValuesProps {
  variables: string[];
  data: DatumEntry[];
}

const ParallelCoordinatesNumericValuesContent = React.memo(
  ({ variables, data }: ParallelCoordinatesNumericValuesProps) => {
    const language = useStore(Selector.language);
    const projectMolecules = useStore(Selector.molecules);

    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<number | undefined>();
    const dataRef = useRef<any[]>([]);

    const { t } = useTranslation();
    const lang = useMemo(() => {
      return { lng: language };
    }, [language]);

    const fontSize = '11px';

    useEffect(() => {
      dataRef.current = [];
      for (const [i, d] of data.entries()) {
        dataRef.current.push({ key: i, ...d });
      }
      setUpdateFlag(!updateFlag);
    }, [data]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (selectedRow !== undefined) {
          switch (e.key) {
            case 'ArrowDown': {
              selectRow(Math.min(selectedRow + 1, data.length - 1));
              break;
            }
            case 'ArrowUp': {
              selectRow(Math.max(0, selectedRow - 1));
              break;
            }
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [selectedRow]);

    const saveCsv = (fileName: string) => {
      let content = 'name, ';
      for (const v of variables) {
        content += v + ', ';
      }
      content += '\n';
      for (const o of data) {
        content += o.name + ', ';
        for (const v of variables) {
          content += o[v] + ', ';
        }
        content += '\n';
      }
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, fileName);
    };

    const selectRow = (index: number | undefined) => {
      setSelectedRow(index);
      usePrimitiveStore.getState().set((state) => {
        for (const [i, m] of projectMolecules.entries()) {
          if (index === i) {
            state.hoveredMolecule = m;
            break;
          }
        }
      });
    };

    return (
      <div style={{ width: '900px' }}>
        <Table
          size={'small'}
          style={{ width: '100%', direction: 'ltr', verticalAlign: 'top' }}
          dataSource={dataRef.current}
          scroll={{ y: 400 }}
          pagination={false}
          onRow={(record, index) => {
            return {
              onClick: () => {
                selectRow(index);
              },
            };
          }}
        >
          <Column
            title={t('molecularViewer.Molecule', lang)}
            dataIndex="name"
            key="name"
            render={(formula, record: any) => {
              return (
                <Typography.Text
                  style={{
                    fontSize,
                    fontWeight: record.selected ? 'bold' : 'normal',
                    color: record.invisible ? 'silver' : 'black',
                    verticalAlign: 'middle',
                  }}
                >
                  {record.name}
                </Typography.Text>
              );
            }}
            onHeaderCell={() => {
              return { style: { fontSize: '10px', fontWeight: 'bold' } };
            }}
            onCell={(record, index) => {
              return {
                style: {
                  paddingLeft: '2px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  border: '1px solid lightgray',
                  background: index === selectedRow ? 'lavender' : 'white',
                },
              };
            }}
          />
          <Column
            title={t('word.Formula', lang)}
            dataIndex="formula"
            key="formula"
            render={(formula, record: any) => {
              return (
                <Typography.Text
                  style={{
                    fontSize,
                    fontWeight: record.selected ? 'bold' : 'normal',
                    color: record.invisible ? 'silver' : 'black',
                    verticalAlign: 'middle',
                  }}
                >
                  {formula}
                </Typography.Text>
              );
            }}
            onHeaderCell={() => {
              return { style: { fontSize: '10px', fontWeight: 'bold' } };
            }}
            onCell={(record, index) => {
              return {
                style: {
                  paddingLeft: '2px',
                  paddingTop: '2px',
                  paddingBottom: '2px',
                  border: '1px solid lightgray',
                  background: index === selectedRow ? 'lavender' : 'white',
                },
              };
            }}
          />
          {variables.map((variable) => {
            return (
              <Column
                title={ProjectUtil.getPropertyName(variable, lang)}
                dataIndex={variable}
                key={variable}
                // width={'10%'}
                render={(value, record: any) => {
                  if (typeof value === 'number') {
                    value = parseFloat(value.toFixed(3));
                  }
                  return (
                    <Typography.Text
                      style={{
                        fontSize,
                        fontWeight: record.selected ? 'bold' : 'normal',
                        color: record.invisible ? 'silver' : 'black',
                        verticalAlign: 'middle',
                      }}
                    >
                      {value}
                    </Typography.Text>
                  );
                }}
                onHeaderCell={() => {
                  return { style: { fontSize: '10px', fontWeight: 'bold' } };
                }}
                onCell={(record, index) => {
                  return {
                    style: {
                      paddingLeft: '2px',
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      border: '1px solid lightgray',
                      background: index === selectedRow ? 'lavender' : 'white',
                    },
                  };
                }}
              />
            );
          })}
        </Table>
        <Space style={{ width: '100%', paddingTop: '10px', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              saveCsv('molecular properties.csv');
            }}
          >
            {t('projectPanel.ExportCsv', lang)}
          </Button>
        </Space>
      </div>
    );
  },
);

export default ParallelCoordinatesNumericValuesContent;
