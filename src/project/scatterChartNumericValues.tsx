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
import { saveAs } from 'file-saver';

interface ScatterChartNumericValuesProps {
  xVariable: string;
  yVariable: string;
  data: { x: number; y: number; invisible: boolean; name: string; formula: string }[];
  setScatterDataHoveredIndex: (index: number) => void;
}

const ScatterChartNumericValues = React.memo(
  ({ xVariable, yVariable, data, setScatterDataHoveredIndex }: ScatterChartNumericValuesProps) => {
    const language = useStore(Selector.language);

    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<number | undefined>();
    const dataRef = useRef<object[]>([]);

    const { t } = useTranslation();
    const lang = useMemo(() => {
      return { lng: language };
    }, [language]);

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
              const i = Math.min(selectedRow + 1, data.length - 1);
              setSelectedRow(i);
              setScatterDataHoveredIndex(i);
              break;
            }
            case 'ArrowUp': {
              const i = Math.max(0, selectedRow - 1);
              setSelectedRow(i);
              setScatterDataHoveredIndex(i);
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
      let content = 'name, ' + xVariable + ', ' + yVariable;
      content += '\n';
      for (const [i, o] of data.entries()) {
        content += data[i].name + ',' + o.x + ', ' + o.y + '\n';
      }
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, fileName);
    };

    const fontSize = '11px';

    return (
      <div style={{ width: '480px' }}>
        <Table
          size={'small'}
          style={{ width: '100%', direction: 'ltr', verticalAlign: 'top' }}
          dataSource={dataRef.current}
          scroll={{ y: 400 }}
          pagination={false}
          onRow={(record, index) => {
            return {
              onClick: () => {
                setSelectedRow(index);
                setScatterDataHoveredIndex(index !== undefined ? index : -1);
              },
            };
          }}
        >
          <Column
            title={t('molecularViewer.Molecule', lang)}
            dataIndex="key"
            key="key"
            render={(i, record, index) => {
              return (
                <Typography.Text
                  style={{
                    fontSize,
                    color: data[index].invisible ? 'silver' : 'black',
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
          <Column
            title={ProjectUtil.getPropertyName(xVariable, lang) ?? xVariable}
            dataIndex="x"
            key="x"
            // width={'45%'}
            render={(x, record, index) => {
              if (typeof x === 'number') {
                x = parseFloat(x.toFixed(3));
              }
              return (
                <Typography.Text
                  style={{
                    fontSize,
                    color: data[index].invisible ? 'silver' : 'black',
                    verticalAlign: 'middle',
                  }}
                >
                  {x}
                </Typography.Text>
              );
            }}
            onHeaderCell={() => {
              return {
                style: { fontSize: '10px', fontWeight: 'bold' },
                title: xVariable ? t('tooltip.' + xVariable, lang) : '',
              };
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
            title={ProjectUtil.getPropertyName(yVariable, lang) ?? yVariable}
            dataIndex="y"
            key="y"
            render={(y, record, index) => {
              if (typeof y === 'number') {
                y = parseFloat(y.toFixed(3));
              }
              return (
                <Typography.Text
                  style={{
                    fontSize,
                    color: data[index].invisible ? 'silver' : 'black',
                    verticalAlign: 'middle',
                  }}
                >
                  {y}
                </Typography.Text>
              );
            }}
            onHeaderCell={() => {
              return {
                style: { fontSize: '10px', fontWeight: 'bold' },
                title: yVariable ? t('tooltip.' + yVariable, lang) : '',
              };
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
        </Table>
        <Space style={{ width: '100%', paddingTop: '10px', justifyContent: 'center' }}>
          <Button
            onClick={() => {
              saveCsv(xVariable + '-' + yVariable + '.csv');
            }}
          >
            {t('projectPanel.ExportCsv', lang)}
          </Button>
        </Space>
      </div>
    );
  },
);

export default ScatterChartNumericValues;
