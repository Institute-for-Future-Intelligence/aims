/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import { useStore } from './stores/common';
import * as Selector from './stores/selector';

export const useLanguage = () => {
  return { lng: useStore(Selector.language) };
};
