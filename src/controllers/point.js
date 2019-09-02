import {Event, EventEdit} from '../components';
import {isEscapeKey} from '../util/predicates';
import {render, Position} from '../util/dom';

export default class PointController {
  constructor(container, eventInfo, onDataChange, onChangeView) {
    this._container = container;
    this._data = eventInfo;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventView = new Event(eventInfo);
    this._eventEdit = new EventEdit(eventInfo);

    this.init();
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    this._eventView.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.replaceChild(this._eventEdit.getElement(), this._eventView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._eventEdit.getElement()
      .querySelector(`.event`)
      .addEventListener(`submit`, (evt) => {
        evt.preventDefault();
        const formData = new FormData(this._eventEdit.getElement().querySelector(`.event--edit`));
        const entry = {
          type: formData.get(`event-type`),
          city: formData.get(`event-destination`),
          description: this._eventEdit.getElement().querySelector(`.event__destination-description`) ?
            this._eventEdit.getElement().querySelector(`.event__destination-description`).textContent : ``,
          images: [...this._eventEdit.getElement().querySelectorAll(`.event__photo`)].map((img) => img.src),
          time: {
            start: new Date(formData.get(`event-start-time`)),
            end: new Date(formData.get(`event-end-time`)),
          },
          price: formData.get(`event-price`),
          offers: [...this._eventEdit.getElement().querySelectorAll(`.event__offer-selector`)].map((offer) => {
            return {
              name: offer.querySelector(`.event__offer-checkbox`).name.replace(`event-offer-`, ``),
              title: offer.querySelector(`.event__offer-title`).textContent,
              price: offer.querySelector(`.event__offer-price`).textContent,
              isAdded: offer.querySelector(`.event__offer-checkbox`).checked,
            };
          }),
          isFavorite: this._eventEdit.getElement().querySelector(`.event__favorite-checkbox`).checked,
        };
        this._onDataChange(entry, this._data);
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    render(this._container, this._eventView.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
    }
  }
}
