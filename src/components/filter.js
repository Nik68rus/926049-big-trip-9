import {createElement} from '../util/dom';

export class Filter {
  constructor({name, isChecked}) {
    this._name = name;
    this._isChecked = isChecked;
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

/*
const getFilterItemMarkup = ({name, isChecked = false}) => {
  const id = name.toLowerCase();
  return `
  <div class="trip-filters__filter">
    <input
      id="filter-${id}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${id}"
      ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${id}">${name}</label>
  </div>
  `.trim();
};

const getFiltersMarkup = makeMarkupGenerator(getFilterItemMarkup, `\n`);

export const getFilterFormMarkup = (elements) => `
  <form class="trip-filters" action="#" method="get">
    ${getFiltersMarkup(elements)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`.trim();
*/
