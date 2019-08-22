import {
  getMenuWrappedMarkup,
  getFilterFormMarkup,
  getSortingMarkup,
  getSorteByTimeEvents,
  getRouteMarkup,
  getCost,
  Event,
  EventEdit,
  Day,
} from './components';

import {renderComponent, render, Position} from './util/dom';
import {Mock} from './mock';

const events = getSorteByTimeEvents(Mock.load());

const menuElements = [
  {name: `Table`, isActive: true},
  {name: `Stats`},
];

const filterElements = [
  {name: `Everything`, isChecked: true},
  {name: `Future`},
  {name: `Past`},
];

const renderEvent = (eventMock) => {
  const event = new Event(eventMock);
  const eventEdit = new EventEdit(eventMock);
  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
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

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripEvents = document.querySelector(`.trip-events`);

renderComponent(tripInfo, getRouteMarkup(events), `afterbegin`);
renderComponent(tripControls, getMenuWrappedMarkup(menuElements), `afterbegin`);
renderComponent(tripControls, getFilterFormMarkup(filterElements), `beforeend`);
renderComponent(tripEvents, getSortingMarkup(), `beforeend`);
renderDay(events[0].time.start);

const tripEventsList = document.querySelector(`.trip-events__list`);

events.forEach(renderEvent);

const price = document.querySelector(`.trip-info__cost-value`);
price.textContent = getCost(events);

