/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import { Spin } from 'antd';

// TODO
const Loading = React.memo(() => {
  return <Spin tip={'Loading...'}></Spin>;
});

export default Loading;
