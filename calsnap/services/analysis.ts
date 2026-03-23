import { AnalysisResult } from '@/types/food';
import api from './api';

export async function getAnalysisResult(imageUri: string): Promise<AnalysisResult> {
  const formData = new FormData();

  const filename = imageUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('image', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  const { data } = await api.post<AnalysisResult>('/analysis/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  });

  return data;
}
