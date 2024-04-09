/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { createWithEqualityFn } from 'zustand/traditional';
import { DataQueue } from '../models/DataQueue.ts';
import { EnergyData } from '../models/EnergyData.ts';
import { DATA_QUEUE_LENGTH } from '../models/physicalConstants.ts';
import { PositionData } from '../models/PositionData.ts';

export interface DataStoreState {
  energyTimeSeries: DataQueue<EnergyData>;
  positionTimeSeriesMap: Map<number, DataQueue<PositionData>>;
}

export const useDataStore = createWithEqualityFn<DataStoreState>()((set, get) => {
  return {
    energyTimeSeries: new DataQueue<EnergyData>(DATA_QUEUE_LENGTH),
    positionTimeSeriesMap: new Map<number, DataQueue<PositionData>>(),
  };
});
