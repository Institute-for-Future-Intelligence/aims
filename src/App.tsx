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

const App = React.memo(() => {
  const locale = useStore(Selector.locale);
  const params = new URLSearchParams(window.location.search);
  const viewOnly = params.get('viewonly') === 'true';

  return (
    <ConfigProvider locale={locale}>
      <ErrorPage>
        {viewOnly ? (
          <AppCreator viewOnly={true} />
        ) : (
          <MyBeforeunload>
            <AppCreator viewOnly={false} />{' '}
          </MyBeforeunload>
        )}
      </ErrorPage>
    </ConfigProvider>
  );
});

const MyBeforeunload = React.memo(({ children }: { children: React.ReactNode }) => {
  const whiteList = ['gen8A3WDDHS2f9Y81muVUz1ZgJ33'];
  const isInWhiteList = whiteList.find((id) => id === useStore.getState().user.uid);

  if (!import.meta.env.PROD && !!isInWhiteList) {
    return children;
  } else {
    return <Beforeunload onBeforeunload={() => ''}>{children}</Beforeunload>;
  }
});

export default App;
