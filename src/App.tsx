/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import './App.css';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { ConfigProvider } from 'antd';
import ErrorPage from './ErrorPage';
import AppCreator from './appCreator';
import { Beforeunload } from 'react-beforeunload';

const App = () => {
  const locale = useStore(Selector.locale);
  const params = new URLSearchParams(window.location.search);
  const viewOnly = params.get('viewonly') === 'true';

  return (
    <ConfigProvider locale={locale}>
      <ErrorPage>
        {viewOnly ? (
          <AppCreator viewOnly={true} />
        ) : (
          <Beforeunload onBeforeunload={() => ''}>
            <AppCreator viewOnly={false} />{' '}
          </Beforeunload>
        )}
      </ErrorPage>
    </ConfigProvider>
  );
};

export default React.memo(App);
