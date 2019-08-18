import {formatDateMarkup, formatTime} from './util';
import {PLACE_TYPES} from '../constants';

const getOfferItemMarkup = ({title, price}) => {
  return `
  <li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>
  `;
};

const getOfferMarkup = (offers) => offers.filter((offer) => offer.isAdded === true).map((offer) => getOfferItemMarkup(offer)).join(`\n`);

const addZero = (number) => number < 10 ? `0` + number : number;

const getDurationMarkup = (time) => {
  const duration = time.end - time.start;
  let durationString = ``;
  const days = Math.trunc(duration / (24 * 60 * 60 * 1000));
  const hours = Math.trunc((duration - days * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
  const minutes = Math.trunc((duration - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000) / (60 * 1000));
  if (days === 0) {
    durationString = addZero(minutes) + `M`;
  }
  if (hours > 0) {
    durationString = addZero(hours) + `H ` + durationString;
  }
  if (days > 0) {
    durationString = addZero(days) + `D ` + durationString;
  }
  return durationString;
};

export const getEventMarkup = ({type, city, time, price, offers}) => {
  return `
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
        ${getOfferMarkup(offers)}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
};
