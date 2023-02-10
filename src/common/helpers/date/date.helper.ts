import * as dayjs from 'dayjs';

export const getDateNow = (): dayjs.Dayjs => dayjs();

export const formatDate = (
  date: Date,
  format: string = 'DD/MM/YYYY HH:mm:ss',
) => dayjs(date).format(format);
