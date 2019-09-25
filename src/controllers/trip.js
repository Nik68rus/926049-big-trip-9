import {render, Position} from '../util/dom';
import {compareEventsByTime} from '../util/tools';
import {formatDate, getDateDifference} from '../components/date-formater';
import PointController from './point';
import {SortType, FilterType, Mode} from '../constants';

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
  constructor(container, events, onDataChange) {
    this._container = container;
    this._events = events;
    this._creatingEvent = null;
    this._sortType = SortType.EVENT;
    this._filterType = FilterType.EVERYTHING;
    this._tripDays = new TripDays();
    this._tripEmpty = new TripEmpty();
    this._sorting = new Sorting();
    this._route = new Route(events);
    this._onDataChange = onDataChange;

    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
  }

  init(events) {
    this._events = events;
    if (this._events.length === 0) {
      render(this._container, this._tripEmpty.getElement(), Position.BEFOREEND);
      return;
    }

    this._events = this._getSorteByTimeEvents(this._events);

    render(this._container, this._sorting.getElement(), Position.BEFOREEND);
    render(tripInfo, this._route.getElement(), Position.AFTERBEGIN);
    this._route.update(this._events);
    this._renderEvents();

    this._sorting.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
    document.querySelector(`.trip-filters`).addEventListener(`change`, this._onFilterChange);
  }

  update() {
    this.init(this._events);
  }

  hide() {
    this._tripDays.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._tripDays.getElement().classList.remove(`visually-hidden`);
  }

  createEvent() {
    const defaultEvent = {
      id: (Math.max.apply(null, this._events.map((point) => point.id)) + 1).toString(),
      type: this._offers[0].name,
      city: ``,
      description: ``,
      images: [],
      time: {
        start: new Date(),
        end: new Date(),
      },
      price: ``,
      offers: this._offers[0].offers,
      isFavorite: false,
    };
    this._onChangeView();

    this._creatingEvent = new PointController(this._tripDays.getElement(), defaultEvent, Mode.ADDING, this._onDataChange, this._onChangeView, this._destinations, this._offers);
    this._subscriptions.push(this._creatingEvent.setDefaultView.bind(this._creatingEvent));
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;
  }

  getOffers(offers) {
    this._offers = offers;
  }

  getDestinations(destinations) {
    this._destinations = destinations;
  }

  _getSorteByTimeEvents(events) {
    return events.sort(compareEventsByTime);
  }

  _renderEvents() {
    this._route.update(this._events);
    this._updateFilterButtons();
    if (this._sortType === SortType.EVENT) {
      this._renderEventsByDefault();
    } else {
      this._renderSortedEvents();
    }
  }

  _renderEventsByDefault() {
    this._events = this._getSorteByTimeEvents(this._events);
    this._tripDays.getElement().innerHTML = ``;
    const dayHeader = this._sorting.getElement().querySelector(`.trip-sort__item--day`);
    const tripDays = this._tripDays.getElement();
    const tripStart = formatDate(this._events[0].time.start);
    const eventDays = this._getFilteredEvents(this._filterType, this._events).map((it) => formatDate(it.time.start));
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
      this._getFilteredEvents(this._filterType, this._events)
        .filter((curentEvent) => formatDate(curentEvent.time.start) === it.date)
        .forEach((curentEvent) => this._renderEvent(dayEvents.getElement(), curentEvent));
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
    this._getFilteredEvents(this._filterType, this._getSortedEvents()).forEach((curentEvent) => this._renderEvent(dayEvents.getElement(), curentEvent));
    price.textContent = this._getCost();
  }

  _renderEvent(container, curentEvent) {
    const pointController = new PointController(container, curentEvent, Mode.DEFAULT, this._onDataChange, this._onChangeView, this._destinations, this._offers);
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
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
    evt.preventDefault();

    if (evt.target.tagName.toLowerCase() !== `label`) {
      return;
    }

    document.querySelector(`.trip-main__event-add-btn`).disabled = false;

    this._sorting.getElement().querySelector(`#sort-${evt.target.dataset.sortType}`).checked = true;
    this._tripDays.getElement().innerHTML = ``;
    this._sortType = evt.target.dataset.sortType;
    this._renderEvents();
  }

  _getSortedEvents() {
    switch (this._sortType) {
      case SortType.TIME:
        return this._events.slice().sort((a, b) => (b.time.end - b.time.start) - (a.time.end - a.time.start));
      case SortType.PRICE:
        return this._events.slice().sort((a, b) => b.price - a.price);
    }
    return this._events;
  }

  _updateFilterButtons() {
    const futureFilterBtn = document.querySelector(`#filter-future`);
    const pastFilterBtn = document.querySelector(`#filter-past`);
    const futureFilterLabel = document.querySelector(`label[for="filter-future"]`);
    const pastFilterLabel = document.querySelector(`label[for="filter-past"]`);

    const setDisabled = (evt) => {
      evt.target.style.opacity = 0.6;
      evt.target.style.cursor = `default`;
    };

    const setEnabled = (evt) => {
      evt.target.style.opacity = ``;
      evt.target.style.cursor = ``;
    };

    const updateFilter = (filter, button, label) => {
      if (this._getFilteredEvents(filter, this._events).length === 0) {
        button.disabled = true;
        label.addEventListener(`mouseover`, setDisabled, false);
        label.removeEventListener(`mouseover`, setEnabled, false);
      } else {
        button.disabled = false;
        label.addEventListener(`mouseover`, setEnabled, false);
        label.removeEventListener(`mouseover`, setDisabled, false);
      }
    };

    updateFilter(FilterType.FUTURE, futureFilterBtn, futureFilterLabel);
    updateFilter(FilterType.PAST, pastFilterBtn, pastFilterLabel);
  }

  _onFilterChange(evt) {
    evt.preventDefault();
    this._filterType = evt.target.id;
    this._tripDays.getElement().innerHTML = ``;
    this._renderEvents();
  }

  _getFilteredEvents(filterType, eventsToFilter) {
    const timeNow = new Date();
    switch (filterType) {
      case FilterType.FUTURE:
        return eventsToFilter.filter((point) => point.time.start > timeNow);
      case FilterType.PAST:
        return eventsToFilter.filter((point) => point.time.start < timeNow);
    }
    return eventsToFilter;
  }
}
