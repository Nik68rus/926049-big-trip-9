import {createElement} from '../util/dom';

export default class SiteMenu {
  constructor({name, isActive}) {
    this._name = name;
    this._isAcive = isActive;
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
    return `
    <a class="trip-tabs__btn  ${this._isActive ? `trip-tabs__btn--active` : ``}" href="#">${this._name}</a>
    `.trim();
  }
}
