import {
  getMenuWrappedMarkup,
  getFilterFormMarkup,
  getSortingMarkup,
  getSorteByTimeEvents,
  getRouteMarkup,
  getEditFormMarkup,
  getDayMarkup,
  getEventsMarkup,
  getCost,
} from './components';

import {renderComponent} from './util/dom';
import {Mock} from './mock';

const eventList = getSorteByTimeEvents(Mock.load());

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

renderComponent(tripInfo, getRouteMarkup(eventList), `afterbegin`);
renderComponent(tripControls, getMenuWrappedMarkup(menuElements), `afterbegin`);
renderComponent(tripControls, getFilterFormMarkup(filterElements), `beforeend`);
renderComponent(tripEvents, getSortingMarkup(), `beforeend`);
renderComponent(tripEvents, getDayMarkup(eventList[0].time.start), `beforeend`);

const tripEventsList = document.querySelector(`.trip-events__list`);

renderComponent(tripEventsList, getEditFormMarkup(eventList[0]), `afterbegin`);
renderComponent(tripEventsList, getEventsMarkup(eventList.slice(1, eventList.length), `beforeend`));

const price = document.querySelector(`.trip-info__cost-value`);
price.textContent = getCost(eventList);

