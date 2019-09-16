import {Event, EventEdit} from '../components';
import {isEscapeKey} from '../util/predicates';
import {render, Position} from '../util/dom';
import {Mode} from '../constants';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

const addBtn = document.querySelector(`.trip-main__event-add-btn`);


export default class PointController {
  constructor(container, eventInfo, mode, onDataChange, onChangeView, destinations, offers) {
    this._container = container;
    this._event = eventInfo;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;
    this._eventView = new Event(eventInfo);
    this._eventEdit = new EventEdit(eventInfo, destinations, offers);
    this._mode = mode;

    this.init(mode);
  }

  init(mode) {
    const eventEditElement = this._eventEdit.getElement();
    const eventViewElement = this._eventView.getElement();

    let renderPosition = Position.BEFOREEND;
    let currentView = this._eventView;
    const resetBtn = eventEditElement.querySelector(`.event__reset-btn`);

    const onAddFormSubmit = (evt) => {
      evt.preventDefault();
      const formData = new FormData(eventEditElement.querySelector(`.event--edit`));
      const entry = {
        id: this._event.id,
        type: formData.get(`event-type`),
        city: formData.get(`event-destination`),
        description: eventEditElement.querySelector(`.event__destination-description`).textContent,
        images: [...eventEditElement.querySelectorAll(`.event__photo`)].map((img) => {
          return {
            src: img.src,
            description: img.alt,
          };
        }),
        time: {
          start: new Date(formData.get(`event-start-time`)).getTime(),
          end: new Date(formData.get(`event-end-time`)).getTime(),
        },
        price: +formData.get(`event-price`),
        offers: [...eventEditElement.querySelectorAll(`.event__offer-selector`)].map((offer) => {
          return {
            name: offer.querySelector(`.event__offer-checkbox`).name.replace(`event-offer-`, ``),
            title: offer.querySelector(`.event__offer-title`).textContent,
            price: +offer.querySelector(`.event__offer-price`).textContent,
            isAdded: offer.querySelector(`.event__offer-checkbox`).checked,
          };
        }),
        isFavorite: eventEditElement.querySelector(`.event__favorite-checkbox`).checked,
      };
      switch (this._mode) {
        case Mode.DEFAULT:
          this._onDataChange(this._eventEdit, `update`, entry);
          eventEditElement.querySelector(`.event__save-btn`).textContent = `Saving...`;
          break;
        case Mode.ADDING:
          this._onDataChange(this._eventEdit, `create`, entry);
          break;
      }
      document.removeEventListener(`keydown`, onEscKeyDown);
      addBtn.disabled = false;
    };

    const onEscKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        if (mode === Mode.ADDING) {
          this._container.removeChild(eventEditElement);
          this._onDataChange(this._eventEdit, null, null);
          addBtn.disabled = false;
        } else {
          this._container.replaceChild(eventViewElement, eventEditElement);
        }
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    if (mode === Mode.ADDING) {
      document.addEventListener(`keydown`, onEscKeyDown);
      renderPosition = Position.AFTERBEGIN;
      currentView = this._eventEdit;
      resetBtn.textContent = `Cancel`;
      eventEditElement.querySelector(`.event__favorite-btn`).classList.add(`visually-hidden`);
    }

    flatpickr(eventEditElement.querySelector(`#event-start-time-1`), {
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._event.time.start,
      altFormat: `d/m/Y H:i`,
    });

    flatpickr(eventEditElement.querySelector(`#event-end-time-1`), {
      altInput: true,
      allowInput: true,
      enableTime: true,
      defaultDate: this._event.time.end,
      altFormat: `d/m/Y H:i`,
    });

    eventViewElement
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.replaceChild(eventEditElement, eventViewElement);
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    eventEditElement
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    eventEditElement
      .querySelector(`.event`)
      .addEventListener(`submit`, onAddFormSubmit);

    resetBtn.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      eventEditElement.querySelector(`.event__reset-btn`).textContent = `Deleting...`;
      this._onDataChange(this._eventEdit, `delete`, this._event);
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
