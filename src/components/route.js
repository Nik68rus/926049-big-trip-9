import {formatDateDay} from './date-formater';

const getStartEndDivider = (events) => {
  const cities = events.map((event) => event.city);
  const citySet = new Set(cities);
  return citySet.size > 2 || (citySet.size === 2 && cities[0] === cities[cities.length - 1]) ? `... &mdash; ` : ``;
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

