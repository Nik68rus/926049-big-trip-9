import {
  getMenuWrappedMarkup,
  getFilterFormMarkup,
  getSortingMarkup,
  getRouteMarkup,
  getEditFormMarkup,
  getDayMarkup,
  renderComponent,
  eventList,
  countPrice,
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

const compareEvents = (a, b) => a.time.start - b.time.start;

eventList.sort(compareEvents);

renderComponent(tripInfo, getRouteMarkup(eventList), `afterbegin`);
renderComponent(tripControls, getMenuWrappedMarkup(menuElements), `afterbegin`);
renderComponent(tripControls, getFilterFormMarkup(filterElements), `beforeend`);
renderComponent(tripEvents, getSortingMarkup(), `beforeend`);
renderComponent(tripEvents, getDayMarkup(eventList[0].time.start), `beforeend`);

const tripEventsList = document.querySelector(`.trip-events__list`);
renderComponent(tripEventsList, getEditFormMarkup(eventList[0]), `afterbegin`);

renderEvents(tripEventsList, eventList.slice(1, eventList.length));

const price = document.querySelector(`.trip-info__cost-value`);
price.textContent = countPrice(eventList);

