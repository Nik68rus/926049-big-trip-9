import {Time} from '../constants';

const dateFormat = new Intl.DateTimeFormat(`en-US`, {
  year: `numeric`,
  month: `numeric`,
  day: `numeric`,
});

const dateFormatMarkup = new Intl.DateTimeFormat(`fr-CA`, {
  year: `numeric`,
  month: `numeric`,
  day: `numeric`,
});

const dateFormatDay = new Intl.DateTimeFormat(`en-US`, {
  month: `short`,
  day: `numeric`,
});

const timeFormat = new Intl.DateTimeFormat(`en-GB`, {
  hour12: false,
  hour: `numeric`,
  minute: `numeric`,
});

export const getDateDifference = (a, b) => {
  const date1 = new Date(a);
  const date2 = new Date(b);
  return Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / Time.DAY);
};

export const formatDate = (date) => dateFormat.format(date);
export const formatDateMarkup = (date) => dateFormatMarkup.format(date);
export const formatDateDay = (date) => dateFormatDay.format(date);
export const formatTime = (date) => timeFormat.format(date);
