import {createElement} from '../util/dom';

export default class Filter {
  constructor({name, isChecked}) {
    this._name = name;
    this._isChecked = isChecked;
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
    const id = this._name.toLowerCase();
    return `
    <div class="trip-filters__filter">
      <input
        id="filter-${id}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${id}"
        ${this._isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${id}">${this._name}</label>
    </div>
  `.trim();
  }
}
