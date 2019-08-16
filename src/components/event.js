import {formatDate, formatTime, formatDuration} from './util';

const getOfferItemMarkup = ({title, price, connector}) => {
  return `
  <li class="event__offer">
    <span class="event__offer-title">${connector} ${title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
  </li>
  `;
};

const getOfferMarkup = (offers) => offers.map((offer) => getOfferItemMarkup(offer)).join(`\n`);

export const getEventMarkup = ({type, city, timeStart, duration, price, offers}) => {
  return `
  <li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} to ${city}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${formatDate(timeStart)}T${formatTime(timeStart)}">${formatTime(timeStart)}</time>
          &mdash;
          <time class="event__end-time" datetime="${formatDate(timeStart + duration)}T${formatTime(timeStart + duration)}">${formatTime(timeStart + duration)}</time>
        </p>
        <p class="event__duration">${formatDuration(duration)}</p>
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
