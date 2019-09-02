import {render, Position} from '../util/dom';
import {formatDate, getDateDifference} from '../components/date-formater';
import PointController from './point';


import {
  TripDays,
  Day,
  DayDate,
  DayEvents,
  TripEmpty,
  Sorting,
  Route,
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

    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
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
  }

  _renderEventsByDefault() {
    this._tripDays.getElement().innerHTML = ``;
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
      this._events.filter((curentEvent) => formatDate(curentEvent.time.start) === it.date).forEach((curentEvent) => this._renderEvent(dayEvents.getElement(), curentEvent));
    });
    price.textContent = this._getCost();
  }

  _renderSortedEvents() {
    this._tripDays.getElement().innerHTML = ``;
    const dayHeader = this._sorting.getElement().querySelector(`.trip-sort__item--day`);
    const tripDays = this._tripDays.getElement();
    const day = new Day();
    const dayDate = new DayDate({day: 0, date: 0}); // временное решение
    const dayEvents = new DayEvents();
    dayHeader.textContent = ``;
    render(tripDays, day.getElement(), Position.BEFOREEND);
    render(day.getElement(), dayDate.getElement(), Position.AFTERBEGIN);
    render(day.getElement(), dayEvents.getElement(), Position.BEFOREEND);
    this._sortedEvents.forEach((curentEvent) => this._renderEvent(dayEvents.getElement(), curentEvent));
    price.textContent = this._getCost();
  }

  _renderEvent(container, curentEvent) {
    const pointController = new PointController(container, curentEvent, this._onDataChange, this._onChangeView);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  _onDataChange(newData, oldData) {
    const defaultSorting = this._sorting.getElement().querySelector(`#sort-event`);
    this._events[this._events.findIndex((it) => it === oldData)] = newData;
    this._sortedEvents[this._sortedEvents.findIndex((it) => it === oldData)] = newData;

    if (defaultSorting.checked) {
      this._renderEventsByDefault();
    } else {
      this._renderSortedEvents();
    }
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
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
