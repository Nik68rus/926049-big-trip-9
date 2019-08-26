import {formatDateMarkup, formatTime} from './date-formater';
import {Time, PLACE_TYPES} from '../constants';
import {makeMarkupGenerator, createElement} from '../util/dom';

export default class Event {
  constructor({type, city, description, images, time, price, offers, isFavorite}) {
    this._type = type;
    this._city = city;
    this._description = description;
    this._images = images;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._isFavorite = isFavorite;
    this._element = null;
  }

  getElement() {
    if (this._element === null) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${this._type} ${PLACE_TYPES.indexOf(this._type) < 0 ? `to` : `in`} ${this._city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDateMarkup(this._time.start)}T${formatTime(this._time.start)}">${formatTime(this._time.start)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDateMarkup(this._time.end)}T${formatTime(this._time.end)}">${formatTime(this._time.end)}</time>
          </p>
          <p class="event__duration">${getDurationMarkup(this._time)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${this._price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${getSelectedOffersMarkup(this._offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `.trim();
  }

  getPrice() {
    return this._price + getEventOffersPrice(this._offers);
  }
}

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
