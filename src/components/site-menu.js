import AbstractComponent from './abstarct-component';

export default class SiteMenu extends AbstractComponent {
  constructor({name, isActive}) {
    super();
    this._name = name;
    this._isAcive = isActive;
  }

  getTemplate() {
    return `
    <a class="trip-tabs__btn  ${this._isActive ? `trip-tabs__btn--active` : ``}" href="#">${this._name}</a>
    `.trim();
  }
}
