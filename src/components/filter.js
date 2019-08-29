import AbstractComponent from './abstarct-component';

export default class Filter extends AbstractComponent {
  constructor({name, isChecked}) {
    super();
    this._name = name;
    this._isChecked = isChecked;
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
