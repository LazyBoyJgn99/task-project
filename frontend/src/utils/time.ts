/**
 * 日期格式化
 */
export function formatDate(date?: string) {
  if (!date) return '';
  const _date = date.split(' ')[0];
  const [year, month, day] = _date.split('-');
  return `${year}年${month}月${day}日`;
}

/**
 * 时间格式化
 */
export function formatTime(time?: string) {
  if (!time) return '';
  const [hour, minute, second] = time.split(':');
  return `${hour}:${minute}:${second}`;
}

/**
 * 日期时间格式化
 */
export function formatDateTime(datetime?: string) {
  if (!datetime) return '';
  const [date, time] = datetime.split(' ');
  return `${formatDate(date)} ${formatTime(time)}`;
}

/**
 * 获取当天的时间
 */
export function getCurrentDate(dateString?: string) {
  const date = new Date(dateString ? dateString : '');
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(year, month, day, 0, 0, 0);
}

/**
 * 根据时间字符串获取时间
 */
export function getDate(dateString: string) {
  const newDateString = dateString.replace(/-/g, '/');
  return new Date(newDateString);
}

/**
 * 格式化日期
 */
export function formatDateToString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化时间
 */
export function formatDateToString_2(year: number, month: number, day: number) {
  const _month = month < 10 ? `0${month}` : month;
  const _day = day < 10 ? `0${day}` : day;
  return `${year}-${_month}-${_day}`;
}

/**
 * 判断时间是否属于当天
 */
export function isToday(date: Date) {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 获取当天00:00:00的Date
 */
export function getToday() {
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0
  );
}

/**
 * 计算两天中的每一天
 */
export function getDatesBetween(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];
  // 使用循环生成日期
  let currentDate = start;
  while (currentDate <= end) {
    dates.push(formatDateToString(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
