import {formatDateDay} from './util';

export const getCitySet = (events) => {
  let cities = new Set();
  events.map((event) => event.city).forEach((city) => cities.add(city));
  return cities;
};

const getStartEndDivider = (events) => {
  const cities = events.map((event) => event.city);
  const middle = ((cities[0] === cities[cities.length - 1] && cities.slice(1, cities.length - 1).some((city) => city !== cities[0])) || getCitySet(events).size > 2) ? true : false;
  return middle ? `... &mdash; ` : ``;
};

const getRoute = (events) => `${events[0].city} &mdash; ${getStartEndDivider(events)} ${events[events.length - 1].city}`;

const getTripDates = (events) => `
${formatDateDay(events[0].time.start)}&nbsp;&mdash;&nbsp;${formatDateDay(events[events.length - 1].time.end)}
`;

export const getRouteMarkup = (events) => {
  return `
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getRoute(events)}</h1>

    <p class="trip-info__dates">${getTripDates(events)}</p>
  </div>
  `;
};

