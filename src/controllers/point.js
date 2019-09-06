import {Event, EventEdit} from '../components';
import {isEscapeKey} from '../util/predicates';
import {render, Position} from '../util/dom';
import {Mode} from '../constants';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';


export default class PointController {
  constructor(container, eventInfo, mode, onDataChange, onChangeView) {
    this._container = container;
    this._event = eventInfo;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventView = new Event(eventInfo);
    this._eventEdit = new EventEdit(eventInfo);

    this.init(mode);
  }

  init(mode) {
    let renderPosition = Position.BEFOREEND;
    let currentView = this._eventView;

    const onAddFormSubmit = (evt) => {
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
      this._onDataChange(entry, this._event);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        if (mode === Mode.ADDING) {
          this._container.getElement().removeChild(this._eventEdit.getElement());
          this._onDataChange(null, null);
        } else {
          this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
        }
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    if (mode === Mode.ADDING) {
      document.addEventListener(`keydown`, onEscKeyDown);
      renderPosition = Position.AFTERBEGIN;
      currentView = this._eventEdit;
    }

    flatpickr(this._eventEdit.getElement().querySelector(`#event-start-time-1`), {
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._event.time.start,
      altFormat: `d/m/Y H:i`,
    });

    flatpickr(this._eventEdit.getElement().querySelector(`#event-end-time-1`), {
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._event.time.end,
      altFormat: `d/m/Y H:i`,
    });

    this._eventView.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.replaceChild(this._eventEdit.getElement(), this._eventView.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._eventEdit.getElement()
      .querySelector(`.event`)
      .addEventListener(`submit`, onAddFormSubmit);

    this._eventEdit.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        this._onDataChange(null, this._event);
      });


    render(this._container, currentView.getElement(), renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
    }
  }
}
