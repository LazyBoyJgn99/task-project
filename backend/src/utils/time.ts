export function NewDate(date?: string | Date | null) {
  if (!date) return null;
  if (typeof date === 'string') return new Date(`${date} 00:00:00`);
  return new Date(date);
}

export function DateToString(date?: Date | null) {
  if (!date) return null;
  return date.toLocaleDateString('en-CA');
}

export function TimeToString(date?: Date | null) {
  if (!date) return null;
  const dateString = date.toLocaleDateString('en-CA');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${dateString} ${hours}:${minutes}:${seconds}`;
}

export function Today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return new Date(`${year}-${month}-${day} 00:00:00`);
}

export function OneYearLater() {
  const today = Today();
  return new Date(Today().setFullYear(today.getFullYear() + 1));
}

export function NextMonthDate(distance = 1) {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + distance, 1, 0, 0, 0);
}

export function PreviousDay(date: Date) {
  const previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);
  return previousDay;
}

export function GetMonthStartAndEnd(date: Date) {
  const startOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    0,
    0,
    0,
  );
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
  );
  return {
    startOfMonth,
    endOfMonth,
  };
}

export function IsToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
