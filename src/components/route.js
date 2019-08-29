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
      <h1 class="trip-info__title">${getRoute(this._events)}</h1>

      <p class="trip-info__dates">${getTripDates(this._events)}</p>
    </div>
  `.trim();
  }
}

const getStartEndDivider = (events) => {
  const cities = events.map((event) => event.city);
  const uniqueCities = new Set(cities);
  return uniqueCities.size > 2 ||
    (uniqueCities.size === 2 && cities[0] === cities[cities.length - 1]) ||
    (uniqueCities.size === 2 && cities[0] !== cities[cities.length - 1] && cities.slice(1, cities.length - 2).some((city) => city !== cities[0])) ?
    `... &mdash; ` : ``;
};

const getRoute = (events) => `${events[0].city} &mdash; ${getStartEndDivider(events)} ${events[events.length - 1].city}`;

const getTripDates = (events) => `
${formatDateDay(events[0].time.start)}&nbsp;&mdash;&nbsp;${formatDateDay(events[events.length - 1].time.end)}
`;
