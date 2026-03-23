export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function getWeekDates(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const start = new Date(baseDate);
  start.setDate(baseDate.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatMonthLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function getCalorieColor(consumed: number, goal: number): string {
  const ratio = consumed / goal;
  if (ratio < 0.5) return '#3B82F6';
  if (ratio < 0.8) return '#4CAD53';
  if (ratio <= 1.0) return '#F59E0B';
  return '#EF4444';
}
