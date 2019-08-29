import {render, Position} from '../util/dom';
import {isEscapeKey} from '../util/predicates';

import {
  TripDays,
  DaySchedule,
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
    this._tripDays = new TripDays();
    this._daySchedule = new DaySchedule(events);
    this._tripEmpty = new TripEmpty();
    this._sorting = new Sorting();
    this._route = new Route(events);
  }

  init() {
    const tripDays = this._tripDays.getElement();
    render(this._container, tripDays, Position.BEFOREEND);

    if (this._events.length === 0) {
      render(this._container, this._tripEmpty.getElement(), Position.BEFOREEND);
    } else {
      render(this._container, this._sorting.getElement(), Position.BEFOREEND);
      render(tripInfo, this._route.getElement(), Position.AFTERBEGIN);
      render(this._container, this._daySchedule.getElement(), Position.BEFOREEND);
      this._events.forEach((event) => this._renderEvent(event));
      price.textContent = this._getCost();
    }
  }

  _renderEvent(eventData) {
    const event = new Event(eventData);
    const eventEdit = new EventEdit(eventData);
    const tripEventsList = this._daySchedule.getElement().querySelector(`.trip-events__list`);

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
}
