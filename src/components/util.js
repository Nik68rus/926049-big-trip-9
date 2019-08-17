export const getMarkup = (dataList, generator) => dataList.map(generator).join(`\n`);
export const renderComponent = (container, component, position) => container.insertAdjacentHTML(position, component);

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

const timeFormat = new Intl.DateTimeFormat(`en-GB`, {
  hour12: false,
  hour: `numeric`,
  minute: `numeric`,
});

export const formatDate = (date) => dateFormat.format(date);
export const formatDateMarkup = (date) => dateFormatMarkup.format(date);
export const formatTime = (date) => timeFormat.format(date);
