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

interface NumericValuesContentProps {
  xVariable: string;
  yVariable: string;
  data: { x: number; y: number }[];
}

const NumericValuesContent = React.memo(({ xVariable, yVariable, data }: NumericValuesContentProps) => {
  const language = useStore(Selector.language);

  const [updateFlag, setUpdateFlag] = React.useState(false);
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

  return (
    <div style={{ width: '280px' }}>
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
          title={'#'}
          dataIndex="key"
          key="key"
          width={'10%'}
          render={(i) => {
            return <Typography.Text style={{ fontSize: '12px', verticalAlign: 'middle' }}>{i}</Typography.Text>;
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
        <Column
          title={ProjectUtil.getPropertyName(xVariable, lang) ?? xVariable}
          dataIndex="x"
          key="x"
          width={'45%'}
          render={(x) => {
            return <Typography.Text style={{ fontSize: '12px', verticalAlign: 'middle' }}>{x}</Typography.Text>;
          }}
          onHeaderCell={() => {
            return { title: xVariable ? t('tooltip.' + xVariable, lang) : '' };
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
        <Column
          title={ProjectUtil.getPropertyName(yVariable, lang) ?? yVariable}
          dataIndex="y"
          key="y"
          width={'45%'}
          render={(y) => {
            return <Typography.Text style={{ fontSize: '12px', verticalAlign: 'middle' }}>{y}</Typography.Text>;
          }}
          onHeaderCell={() => {
            return { title: yVariable ? t('tooltip.' + yVariable, lang) : '' };
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
      </Table>
    </div>
  );
});

export default NumericValuesContent;
