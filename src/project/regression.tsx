/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { usePrimitiveStore } from '../stores/commonPrimitive.ts';
import * as Selector from '../stores/selector';
import { useEffect } from 'react';
import { PolynomialRegression } from 'ml-regression-polynomial';
import { useStore } from '../stores/common.ts';

export interface RegressionProps {
  data: { x: number; y: number }[];
}

const Regression = ({ data }: RegressionProps) => {
  const regressionDegree = useStore(Selector.regressionDegree) ?? 1;
  const regressionAnalysis = usePrimitiveStore(Selector.regressionAnalysis);

  useEffect(() => {
    if (regressionAnalysis) {
      const x: number[] = [];
      const y: number[] = [];
      for (const d of data) {
        x.push(d.x);
        y.push(d.y);
      }
      usePrimitiveStore.getState().set((state) => {
        state.regression = new PolynomialRegression(x, y, regressionDegree);
      });
    }
  }, [regressionAnalysis]);

  return <></>;
};

export default Regression;
