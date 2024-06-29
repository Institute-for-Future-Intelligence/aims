/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { Table, Typography } from 'antd';
import Column from 'antd/lib/table/Column';
import { useStore } from '../stores/common.ts';
import * as Selector from '../stores/selector';
import { ProjectUtil } from './ProjectUtil.ts';
import { useTranslation } from 'react-i18next';
import { DatumEntry } from '../types.ts';

interface ParallelCoordinatesNumericValuesProps {
  variables: string[];
  data: DatumEntry[];
}

const ScatterChartNumericValuesContent = React.memo(({ variables, data }: ParallelCoordinatesNumericValuesProps) => {
  const language = useStore(Selector.language);

  const [updateFlag, setUpdateFlag] = React.useState(false);
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

  return (
    <div style={{ width: '800px' }}>
      <Table
        size={'small'}
        style={{ width: '100%', direction: 'ltr', verticalAlign: 'top' }}
        dataSource={dataRef.current}
        scroll={{ y: 400 }}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
          position: ['bottomCenter'],
          pageSizeOptions: ['50', '100', '200'],
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
          onCell={() => {
            return {
              style: {
                paddingLeft: '2px',
                paddingTop: '2px',
                paddingBottom: '2px',
                border: '1px solid lightgray',
                background: 'white',
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
              onCell={() => {
                return {
                  style: {
                    paddingLeft: '2px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    border: '1px solid lightgray',
                    background: 'white',
                  },
                };
              }}
            />
          );
        })}
      </Table>
    </div>
  );
});

export default ScatterChartNumericValuesContent;
