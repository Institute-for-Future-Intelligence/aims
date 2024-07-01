/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
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

interface ParallelCoordinatesNumericValuesProps {
  variables: string[];
  data: DatumEntry[];
}

const ScatterChartNumericValuesContent = React.memo(({ variables, data }: ParallelCoordinatesNumericValuesProps) => {
  const language = useStore(Selector.language);

  const [updateFlag, setUpdateFlag] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number | undefined>();
  const dataRef = useRef<any[]>([]);

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

  return (
    <div style={{ width: '800px' }}>
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
            },
          };
        }}
      >
        <Column
          title={t('molecularViewer.Molecule', lang)}
          dataIndex="formula"
          key="formula"
          // width={'10%'}
          render={(formula, record: any) => {
            return (
              <Typography.Text
                style={{ fontSize: '12px', color: record.invisible ? 'silver' : 'black', verticalAlign: 'middle' }}
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
                return (
                  <Typography.Text
                    style={{ fontSize: '12px', color: record.invisible ? 'silver' : 'black', verticalAlign: 'middle' }}
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
});

export default ScatterChartNumericValuesContent;
