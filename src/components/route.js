import {formatDateDay} from './date-formater';
import {createElement} from '../util/dom';

export class Route {
  constructor(events) {
    this._events = events;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getRoute(this._events)}</h1>

      <p class="trip-info__dates">${getTripDates(this._events)}</p>
    </div>
  `.trim();
  }
}

const getStartEndDivider = (events) => {
  const cities = events.map((event) => event.city);
  const uniqueCities = new Set(cities);
  return uniqueCities.size > 2 || (uniqueCities.size === 2 && cities[0] === cities[cities.length - 1]) ? `... &mdash; ` : ``;
};

const getRoute = (events) => `${events[0].city} &mdash; ${getStartEndDivider(events)} ${events[events.length - 1].city}`;

const getTripDates = (events) => `
${formatDateDay(events[0].time.start)}&nbsp;&mdash;&nbsp;${formatDateDay(events[events.length - 1].time.end)}
`;

export const getRouteMarkup = (events) => `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getRoute(events)}</h1>

    <p class="trip-info__dates">${getTripDates(events)}</p>
  </div>
`;

