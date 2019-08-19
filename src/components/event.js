import {formatDateMarkup, formatTime} from './date-formater';
import {PLACE_TYPES, Time} from '../constants';
import {makeMarkupGenerator} from '../util/dom';

const getOfferItemMarkup = ({title, price}) => `
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>
`;

const getOffersMarkup = makeMarkupGenerator(getOfferItemMarkup, `\n`);

const getSelectedOffersMarkup = (offers) =>
  getOffersMarkup(offers.filter((offer) => offer.isAdded === true));

const addZero = (number) =>
  number < 10 ? `0` + number : number;

const getDays = (period) =>
  Math.trunc(period / (Time.DAY));

const getHours = (period) =>
  Math.trunc((period - getDays(period) * Time.DAY) / Time.HOUR);

const getMinutes = (period) =>
  Math.trunc((period - getDays(period) * Time.DAY - getHours(period) * Time.HOUR) / Time.MINUTE);

const getDurationMarkup = (time) => {
  const duration = time.end - time.start;
  let durationString = ``;
  const days = getDays(duration);
  const hours = getHours(duration);
  const minutes = getMinutes(duration);
  durationString = (days === 0) ? addZero(minutes) + `M` : durationString;
  durationString = (hours > 0) ? addZero(hours) + `H ` + durationString : durationString;
  durationString = (days > 0) ? addZero(days) + `D ` + durationString : durationString;
  return durationString;
};

const priceReducer = (acc, it) =>
  acc + it;

const getEventOffersPrice = (offers) =>
  offers
    .map((offer) => offer.isAdded ? offer.price : 0)
    .reduce(priceReducer, 0);

const getEventPrice = (event) =>
  event.price + getEventOffersPrice(event.offers);

export const getCost = (events) => {
  let cost = 0;
  events.forEach((event) => {
    cost = cost + getEventPrice(event);
  });
  return cost;
};

const getEventMarkup = ({type, city, time, price, offers}) => `
  <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${PLACE_TYPES.indexOf(type) < 0 ? `to` : `in`} ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDateMarkup(time.start)}T${formatTime(time.start)}">${formatTime(time.start)}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatDateMarkup(time.end)}T${formatTime(time.end)}">${formatTime(time.end)}</time>
        </p>
        <p class="event__duration">${getDurationMarkup(time)}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getSelectedOffersMarkup(offers)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
`;

export const getEventsMarkup = makeMarkupGenerator(getEventMarkup, `\n`);
