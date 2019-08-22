import {formatDateDay, formatDateMarkup} from './date-formater';
import {createElement} from '../util/dom';

export class Day {
  constructor(date) {
    this._date = date;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `
    <ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">1</span>
          <time class="day__date" datetime="${formatDateMarkup(this._date)}">${formatDateDay(this._date)}</time>
        </div>
        <ul class="trip-events__list">

        </ul>
      </li>
    </ul>
    `.trim();
  }
}
