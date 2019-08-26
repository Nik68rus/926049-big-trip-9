import {
  SiteMenu,
  Event,
  EventEdit,
  Day,
  Route,
  Filter,
  Sorting,
} from './components';

import {render, Position} from './util/dom';
import {isEscapeKey} from './util/predicates';
import {Mock} from './mock';

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripEvents = document.querySelector(`.trip-events`);
const price = document.querySelector(`.trip-info__cost-value`);

const menuElements = [
  {name: `Table`, isActive: true},
  {name: `Stats`},
];

const filterElements = [
  {name: `Everything`, isChecked: true},
  {name: `Future`},
  {name: `Past`},
];

const compareEventsByTime = (a, b) => a.time.start - b.time.start;

const getSorteByTimeEvents = (events) => events.sort(compareEventsByTime);

const renderEvent = (eventMock) => {
  const tripEventsList = document.querySelector(`.trip-events__list`);
  const event = new Event(eventMock);
  const eventEdit = new EventEdit(eventMock);
  const onEscKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      tripEventsList.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  event.getElement()
    .querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      tripEventsList.replaceChild(eventEdit.getElement(), event.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  eventEdit.getElement()
    .querySelector(`.event`)
    .addEventListener(`submit`, () => {
      tripEventsList.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(tripEventsList, event.getElement(), Position.BEFOREEND);
};

const renderDay = (date) => {
  const day = new Day(date);
  render(tripEvents, day.getElement(), Position.BEFOREEND);
};

const renderRoute = (points) => {
  const route = new Route(points);
  render(tripInfo, route.getElement(), Position.AFTERBEGIN);
};

const renderFilterWrapper = () => {
  const filterWrapper = `
  <form class="trip-filters" action="#" method="get">
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`.trim();
  tripControls.insertAdjacentHTML(Position.BEFOREEND, filterWrapper);
};

const renderFilter = (filterType) => {
  const tripFilters = document.querySelector(`.trip-filters`);
  const filter = new Filter(filterType);
  render(tripFilters, filter.getElement(), Position.BEFOREEND);
};

const renderMenuWrapper = () => {
  const menuWrapper = `
  <nav class="trip-controls__trip-tabs  trip-tabs">
  </nav>
`.trim();
  tripControls.insertAdjacentHTML(Position.AFTERBEGIN, menuWrapper);
};

const renderMenu = (menuItem) => {
  const menuContainer = document.querySelector(`.trip-controls__trip-tabs`);
  const menu = new SiteMenu(menuItem);
  render(menuContainer, menu.getElement(), Position.BEFOREEND);
};

const renderSorting = () => {
  const sorting = new Sorting();
  render(tripEvents, sorting.getElement(), Position.BEFOREEND);
};

const getCost = (points) => {
  let cost = 0;
  points.forEach((it) => {
    const event = new Event(it);
    cost = cost + event.getPrice();
  });
  return cost;
};

const events = getSorteByTimeEvents(Mock.load());

renderRoute(events);
renderMenuWrapper();
menuElements.forEach(renderMenu);
renderFilterWrapper();
filterElements.forEach(renderFilter);
renderSorting();
renderDay(events[0].time.start);
events.forEach(renderEvent);

price.textContent = getCost(events);

