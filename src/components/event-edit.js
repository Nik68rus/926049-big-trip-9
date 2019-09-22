import {PLACE_TYPES, ACTION_TYPES} from '../constants';
import {formatDate, formatTime} from './date-formater';
import {makeMarkupGenerator} from '../util/dom';
import {makeFirstCharCapital, hideIfTrue} from '../util/tools';
import AbstractComponent from './abstarct-component';

export default class EventEdit extends AbstractComponent {
  constructor({type, city, description, images, time, price, offers, isFavorite}, destinations, typeOffers) {
    super();
    this._type = type;
    this._city = city;
    this._description = description;
    this._images = images;
    this._time = time;
    this._price = price;
    this._offers = offers;
    this._isFavorite = isFavorite;

    this._CitiesWithDescription = destinations;
    this._TypeOffers = typeOffers;

    this._CITIES = destinations.map((destination) => destination.name);

    this._typeInit();
    this._cityInit();
    this._detailsInit();
  }

  _typeInit() {
    const element = this.getElement();
    const typeButtons = element.querySelectorAll(`.event__type-input`);
    const offerSection = element.querySelector(`.event__section--offers`);
    const currentOffers = element.querySelector(`.event__available-offers`);

    const onTypeClick = (evt) => {
      const type = evt.target.value;
      const curentType = this._TypeOffers.find(({name}) => name === type);

      hideIfTrue(offerSection, curentType.offers.length === 0);

      element.querySelector(`.event__type-icon`).src = `img/icons/${curentType.name}.png`;
      element.querySelector(`.event__type-output`).textContent = `${makeFirstCharCapital(curentType.name)} ${PLACE_TYPES.indexOf(curentType.name) < 0 ? `to` : `in`}`;
      element.querySelector(`.event__type-toggle`).checked = false;

      currentOffers.innerHTML = ``;
      currentOffers.insertAdjacentHTML(`beforeEnd`, getEventOffersMarkup(curentType.offers));
      this._detailsInit();
    };

    hideIfTrue(offerSection, this._offers.length === 0);

    typeButtons.forEach((type) => {
      type.addEventListener(`click`, onTypeClick);
    });
  }

  _cityInit() {
    const element = this.getElement();
    const city = element.querySelector(`.event__input--destination`);
    const description = element.querySelector(`.event__destination-description`);
    const photoContainer = element.querySelector(`.event__photos-container`);
    const photoTape = element.querySelector(`.event__photos-tape`);

    const onCityChange = () => {
      const cityInfo = this._CitiesWithDescription.find(({name}) => name === city.value);
      description.textContent = cityInfo.description;
      hideIfTrue(photoContainer, cityInfo.images.length === 0);
      photoTape.innerHTML = getPhotosMarkup(cityInfo.images);
      this._detailsInit();
    };

    hideIfTrue(photoContainer, this._images.length === 0);

    city.addEventListener(`change`, onCityChange);
  }

  _detailsInit() {
    const element = this.getElement();
    const eventDetails = element.querySelector(`.event__details`);
    const destinationHeader = element.querySelector(`.event__section-title--destination`);
    const hasNoDescription = element.querySelector(`.event__destination-description`).textContent.length < 1;
    const hasNoOffers = element.querySelector(`.event__section--offers`).classList.contains(`visually-hidden`);
    const hasNoPictures = element.querySelector(`.event__photos-tape`).children.length < 1;
    hideIfTrue(eventDetails, hasNoDescription && hasNoOffers && hasNoPictures);
    hideIfTrue(destinationHeader, hasNoDescription && hasNoPictures);
  }

  _unblock() {
    this._element.querySelectorAll(`input, button`)
      .forEach((it) => it.removeAttribute(`disabled`));
    this._element.querySelector(`.event__save-btn`).textContent = `Save`;
    this._element.querySelector(`.event__reset-btn`).textContent = `Delete`;
  }

  block() {
    this._element.querySelectorAll(`input, button`)
      .forEach((it) => it.setAttribute(`disabled`, `disabled`));
  }

  shakeRed() {
    const ANIMATION_TIMEOUT = 600;
    const formElement = this._element.querySelector(`.event--edit`);
    formElement.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    formElement.style.boxShadow = `0 0 15px 2px red`;
    formElement.style.borderRadius = `18px`;

    setTimeout(() => {
      formElement.style.animation = ``;
      formElement.style.boxShadow = ``;
      formElement.style.borderRadius = ``;
      this._unblock();
    }, ANIMATION_TIMEOUT);
  }

  getTemplate() {
    return `
    <li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${getTypeChooserMarkup(ACTION_TYPES, this._type)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${getTypeChooserMarkup(PLACE_TYPES, this._type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${makeFirstCharCapital(this._type)} ${PLACE_TYPES.indexOf(this._type) < 0 ? `to` : `in`}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${getDestinationListMarkup(this._CITIES)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text" name="event-start-time"
              value="${formatDate(this._time.start)} ${formatTime(this._time.start)}"
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${formatDate(this._time.end)} ${formatTime(this._time.end)}"
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input
            id="event-favorite-1"
            class="event__favorite-checkbox  visually-hidden"
            type="checkbox"
            name="event-favorite"
            ${this._isFavorite ? `checked` : ``}
          >
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">

          ${getOffersContainerMarkup(this._offers)}

          <section class="event__section  event__section--destination">
            ${getDestinationMarkup(this._description)}
            ${getPhotoContainerMarkup(this._images)}
          </section>
        </section>
      </form>
    </li>
  `.trim();
  }
}

const getTypeChooserMarkup = (types, currentType) =>
  types.map((type) => `
    <div class="event__type-item">
      <input
        id="event-type-${type.toLowerCase()}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type.toLowerCase()}"
        ${type === currentType ? `checked` : ``}
      >
      <label
        class="event__type-label  event__type-label--${type.toLowerCase()}"
        for="event-type-${type.toLowerCase()}-1">${makeFirstCharCapital(type)}</label>
    </div>
  `).join(`\n`);

const getDestinationItemMarkup = (city) =>
  `<option value="${city}"></option>`;

const getDestinationListMarkup = makeMarkupGenerator(getDestinationItemMarkup, `\n`);

const getEventOfferMarkup = ({title, name, price, isAdded}) => `
  <div class="event__offer-selector">
    <input
      class="event__offer-checkbox  visually-hidden"
      id="event-offer-${name}-1"
      type="checkbox"
      name="event-offer-${name}"
      ${isAdded ? `checked` : ``}
    >
    <label class="event__offer-label" for="event-offer-${name}-1">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const getEventOffersMarkup = makeMarkupGenerator(getEventOfferMarkup, `\n`);

const getOffersContainerMarkup = (offers) => `
    <section class="event__section  event__section--offers ${offers.size === 0 ? `visually-hidden` : ``}">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${getEventOffersMarkup(offers)}
      </div>
    </section>
  `;

const getDestinationMarkup = (text) =>`
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${text}</p>
`;

const getPhotoMarkup = ({src, description}) =>
  `<img class="event__photo" src="${src}" alt="${description}">`;

const getPhotosMarkup = makeMarkupGenerator(getPhotoMarkup, `\n`);

const getPhotoContainerMarkup = (images) => `
  <div class="event__photos-container">
    <div class="event__photos-tape">
      ${images.length > 0 ? getPhotosMarkup(images) : ``}
    </div>
  </div>
`;
