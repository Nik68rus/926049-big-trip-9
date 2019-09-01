import {render, Position} from '../util/dom';
import {isEscapeKey} from '../util/predicates';
import {formatDate, getDateDifference} from '../components/date-formater';

import {
  TripDays,
  Day,
  DayDate,
  DayEvents,
  TripEmpty,
  Sorting,
  Route,
  EventEdit,
  Event,
} from '../components';

const tripInfo = document.querySelector(`.trip-main__trip-info`);
const price = document.querySelector(`.trip-info__cost-value`);

export default class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._sortedEvents = events;
    this._tripDays = new TripDays();
    this._tripEmpty = new TripEmpty();
    this._sorting = new Sorting();
    this._route = new Route(events);
  }

  init() {
    if (this._events.length === 0) {
      render(this._container, this._tripEmpty.getElement(), Position.BEFOREEND);
      return;
    }
    render(this._container, this._sorting.getElement(), Position.BEFOREEND);
    this._sorting.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));

    render(tripInfo, this._route.getElement(), Position.AFTERBEGIN);
    this._renderEventsByDefault();
    price.textContent = this._getCost();
  }

  _renderEventsByDefault() {
    const dayHeader = this._sorting.getElement().querySelector(`.trip-sort__item--day`);
    const tripDays = this._tripDays.getElement();
    const tripStart = formatDate(this._events[0].time.start);
    const eventDays = this._events.map((it) => formatDate(it.time.start));
    const uniqueDays = [...new Set(eventDays)];
    const uniqueDaysWithNumbers = uniqueDays.map((it) => {
      return {
        date: it,
        day: getDateDifference(tripStart, it) + 1,
      };
    });
    dayHeader.textContent = `DAY`;
    render(this._container, tripDays, Position.BEFOREEND);

    uniqueDaysWithNumbers.forEach((it) => {
      const curentDay = new Day();
      const dayDate = new DayDate(it);
      const dayEvents = new DayEvents();
      render(tripDays, curentDay.getElement(), Position.BEFOREEND);
      render(curentDay.getElement(), dayDate.getElement(), Position.AFTERBEGIN);
      render(curentDay.getElement(), dayEvents.getElement(), Position.BEFOREEND);
      this._events.filter((event) => formatDate(event.time.start) === it.date).forEach((event) => this._renderEvent(dayEvents.getElement(), event));
    });
  }

  _renderSortedEvents() {
    const dayHeader = this._sorting.getElement().querySelector(`.trip-sort__item--day`);
    const tripDays = this._tripDays.getElement();
    const day = new Day();
    const dayDate = new DayDate({day: 0, date: 0}); // временное решение
    const dayEvents = new DayEvents();
    dayHeader.textContent = ``;
    render(tripDays, day.getElement(), Position.BEFOREEND);
    render(day.getElement(), dayDate.getElement(), Position.AFTERBEGIN);
    render(day.getElement(), dayEvents.getElement(), Position.BEFOREEND);
    this._sortedEvents.forEach((event) => this._renderEvent(dayEvents.getElement(), event));
  }

  _renderEvent(container, eventData) {
    const event = new Event(eventData);
    const eventEdit = new EventEdit(eventData);
    const tripEventsList = container;

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
  }

  _getCost() {
    let cost = 0;
    this._events.forEach((it) => {
      const event = new Event(it);
      cost += event.getPrice();
    });
    return cost;
  }

  _onSortClick(evt) {
    const sorting = this._sorting.getElement();
    evt.preventDefault();

    if (evt.target.tagName.toLowerCase() !== `label`) {
      return;
    }

    this._tripDays.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `time`:
        sorting.querySelector(`#sort-time`).checked = true;
        this._sortedEvents = this._events.slice().sort((a, b) => (b.time.end - b.time.start) - (a.time.end - a.time.start));
        this._renderSortedEvents();
        break;
      case `price`:
        sorting.querySelector(`#sort-price`).checked = true;
        this._sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
        this._renderSortedEvents();
        break;
      case `default`:
        sorting.querySelector(`#sort-event`).checked = true;
        this._sortedEvents = this._events;
        this._renderEventsByDefault();
        break;
    }
  }
}
