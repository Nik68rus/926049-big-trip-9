const dateFormat = new Intl.DateTimeFormat(`en-GB`, {
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

export const formatDate = (date) => dateFormat.format(date);
export const formatDateMarkup = (date) => dateFormatMarkup.format(date);
export const formatDateDay = (date) => dateFormatDay.format(date);
export const formatTime = (date) => timeFormat.format(date);
