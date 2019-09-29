import {formatDateDay} from './date-formater';
import AbstractComponent from './abstarct-component';

export default class Route extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return `
    <div class="trip-info__main">
      <h1 class="trip-info__title"></h1>

      <p class="trip-info__dates"></p>
    </div>
  `.trim();
  }

  update(events) {
    this._events = events;
    this.getElement().querySelector(`.trip-info__title`).textContent = this._events.length === 0 ? `` : this._getRoute();
    this.getElement().querySelector(`.trip-info__dates`).textContent = this._events.length === 0 ? `` : this._getTripDates();
  }

  _getStartEndDivider() {
    const cities = this._events.map((curentEvent) => curentEvent.city);
    const uniqueCities = new Set(cities);
    return uniqueCities.size > 2 ||
      (uniqueCities.size === 2 && cities[0] === cities[cities.length - 1]) ||
      (uniqueCities.size === 2 && cities[0] !== cities[cities.length - 1] && cities.slice(1, cities.length - 2).some((city) => city !== cities[0])) ?
      `... \u2013 ` : ``;
  }

  _getRoute() {
    return `${this._events[0].city} \u2013 ${this._getStartEndDivider()} ${this._events[this._events.length - 1].city}`;
  }

  _getTripDates() {
    return `${formatDateDay(this._events[0].time.start)} \u2013 ${formatDateDay(this._events[this._events.length - 1].time.end)}`;
  }
}
