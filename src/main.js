import {
  getMenuWrappedMarkup,
  getFilterFormMarkup,
  getSortingMarkup,
  getRouteMarkup,
  getEditFormMarkup,
  getDayMarkup,
  renderComponent,
  eventList,
  getEventMarkup,
} from './components';

const menuElements = [
  {name: `Table`, isActive: true},
  {name: `Stats`},
];

const filterElements = [
  {name: `Everything`, isChecked: true},
  {name: `Future`},
  {name: `Past`},
];

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripEvents = document.querySelector(`.trip-events`);

const renderEvents = (container, events) => {
  container.insertAdjacentHTML(`beforeend`, events.map(getEventMarkup).join(`\n`));
};

renderComponent(tripInfo, getRouteMarkup(), `afterbegin`);
renderComponent(tripControls, getMenuWrappedMarkup(menuElements), `afterbegin`);
renderComponent(tripControls, getFilterFormMarkup(filterElements), `beforeend`);
renderComponent(tripEvents, getSortingMarkup(), `beforeend`);
renderComponent(tripEvents, getDayMarkup(), `beforeend`);

const tripEventsList = document.querySelector(`.trip-events__list`);
renderEvents(tripEventsList, eventList);
//renderComponent(tripEventsList, getEditFormMarkup(), `afterbegin`);
