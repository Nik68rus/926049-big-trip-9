import {Event, EventEdit} from '../components';
import {isEscapeKey} from '../util/predicates';
import {render, Position} from '../util/dom';
import {Mode} from '../constants';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const addBtn = document.querySelector(`.trip-main__event-add-btn`);


export default class PointController {
  constructor(container, eventInfo, mode, onDataChange, onChangeView) {
    this._container = container;
    this._event = eventInfo;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventView = new Event(eventInfo);
    this._eventEdit = new EventEdit(eventInfo);
    this._mode = mode;

    this.init(mode);
  }

  init(mode) {
    let renderPosition = Position.BEFOREEND;
    let currentView = this._eventView;
    const resetBtn = this._eventEdit.getElement().querySelector(`.event__reset-btn`);

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
      this._onDataChange(entry, mode === Mode.DEFAULT ? this._event : null);
      document.removeEventListener(`keydown`, onEscKeyDown);
      addBtn.disabled = false;
    };

    const onEscKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        if (mode === Mode.ADDING) {
          this._container.removeChild(this._eventEdit.getElement());
          this._onDataChange(null, null);
          addBtn.disabled = false;
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
      resetBtn.textContent = `Cancel`;
      this._eventEdit.getElement().querySelector(`.event__favorite-btn`).classList.add(`visually-hidden`);
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
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._eventEdit.getElement()
      .querySelector(`.event`)
      .addEventListener(`submit`, onAddFormSubmit);

    resetBtn.addEventListener(`click`, (evt) => {
      if (mode === Mode.DEFAULT) {
        evt.preventDefault();
        this._onDataChange(null, this._event);
      } else {
        this._onDataChange(null, null);
        addBtn.disabled = false;
      }
    });

    if (mode === Mode.ADDING && currentView === this._eventEdit) {
      currentView.getElement().children[0].classList.add(`trip-events__item`);
    }

    render(this._container, currentView.getElement(), renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      if (this._mode === Mode.DEFAULT) {
        this._container.replaceChild(this._eventView.getElement(), this._eventEdit.getElement());
      } else {
        this._container.removeChild(this._eventEdit.getElement());
        addBtn.disabled = false;
      }
    }
  }
}
