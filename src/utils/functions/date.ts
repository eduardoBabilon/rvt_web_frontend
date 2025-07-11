import moment from 'moment';

type DateOptionDisplay = {
  formatHour?: string;
};

export function getDays(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function formatDate(date: Date | string, options?: DateOptionDisplay) {
  if (!date) return '';
  const normalizedDate = new Date(date);

  const { formatHour } = options || {};
  const hour = formatHour ? formatHour : 'HH:mm';
  return moment(normalizedDate).format(`DD/MM/YYYY`);
}

export function formatDate1(date: Date | string, options?: DateOptionDisplay) {
  if (!date) return '';
  const normalizedDate = new Date(date);

  const { formatHour } = options || {};
  const hour = formatHour ? formatHour : 'HH:mm';
  return moment(normalizedDate).format(`DD/MM/YYYY ${hour}`);
}

export function getDateExpireInSeconds(futureDate: Date) {
  const actualDate = Date.now();
  const timeDiferenceInMilliseconds = futureDate.getTime() - actualDate;
  const timeDifferenceInSeconds = Math.floor(timeDiferenceInMilliseconds / 1000);
  const expireInSeconds = timeDifferenceInSeconds;
  return expireInSeconds;
}

export function addDaysToDate(date: Date, days: number) {
  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

  return newDate;
}

export function isSameDay(a: moment.Moment | null, b: moment.Moment | null) {
  if (!moment.isMoment(a) || !moment.isMoment(b)) return false;
  return a.date() === b.date() && a.month() === b.month() && a.year() === b.year();
}
