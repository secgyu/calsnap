import api from './api';

export interface WeightRecord {
  id: string;
  weight: number;
  memo?: string;
  recordedAt: string;
  date?: string;
  time?: string;
}

export interface WeightSummary {
  currentWeight: number;
  lastRecordedAt: string | null;
  weekChange: number;
  monthChange: number;
  goalWeight: number;
  chartData: { date: string; weight: number }[];
  recentRecords: WeightRecord[];
}

export async function getWeightSummary(): Promise<WeightSummary> {
  const { data } = await api.get<WeightSummary>('/weight/summary');
  return data;
}

export async function createWeightRecord(payload: {
  weight: number;
  memo?: string;
  recordedAt: string;
}): Promise<WeightRecord> {
  const { data } = await api.post<WeightRecord>('/weight', payload);
  return data;
}

export async function deleteWeightRecord(id: string): Promise<void> {
  await api.delete(`/weight/${id}`);
}
