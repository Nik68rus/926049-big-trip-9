import {render, Position} from '../util/dom';
import {isEscapeKey} from '../util/predicates';

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
    this._day = new Day();
    this._dayDate = new DayDate({day: 1, date: this._events[0].time.start}); // временное решение
    this._dayEvents = new DayEvents();
    this._tripEmpty = new TripEmpty();
    this._sorting = new Sorting();
    this._route = new Route(events);
  }

  init() {
    const tripDays = this._tripDays.getElement();
    const day = this._day.getElement();

    if (this._events.length === 0) {
      render(this._container, this._tripEmpty.getElement(), Position.BEFOREEND);
    } else {
      render(this._container, this._sorting.getElement(), Position.BEFOREEND);
      this._sorting.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));

      render(tripInfo, this._route.getElement(), Position.AFTERBEGIN);
      render(this._container, tripDays, Position.BEFOREEND);
      render(tripDays, day, Position.BEFOREEND);
      render(day, this._dayDate.getElement(), Position.AFTERBEGIN);
      render(day, this._dayEvents.getElement(), Position.BEFOREEND);

      this._events.forEach((event) => this._renderEvent(event));
      price.textContent = this._getCost();
    }
  }

  _renderEvent(eventData) {
    const event = new Event(eventData);
    const eventEdit = new EventEdit(eventData);
    const tripEventsList = this._dayEvents.getElement();

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

    this._dayEvents.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `time`:
        sorting.querySelector(`#sort-time`).checked = true;
        this._sortedEvents = this._events.slice().sort((a, b) => (b.time.end - b.time.start) - (a.time.end - a.time.start));
        break;
      case `price`:
        sorting.querySelector(`#sort-price`).checked = true;
        this._sortedEvents = this._events.slice().sort((a, b) => b.price - a.price);
        break;
      case `default`:
        sorting.querySelector(`#sort-event`).checked = true;
        this._sortedEvents = this._events;
        break;
    }
    this._sortedEvents.forEach((event) => this._renderEvent(event));
  }
}
