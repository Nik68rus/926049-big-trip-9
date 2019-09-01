import AbstractComponent from './abstarct-component';
import {formatDateDay, formatDateMarkup} from './date-formater';

export default class DayDate extends AbstractComponent {
  constructor({day, date}) {
    super();
    this._day = day;
    this._date = date;
  }

  getTemplate() {
    return this._day === 0 ?
      `<div class="day__info"></div>` :
      `<div class="day__info">
        <span class="day__counter">${this._day}</span>
        <time class="day__date" datetime="${formatDateMarkup(new Date(this._date))}">${formatDateDay(new Date(this._date))}</time>
      </div>
    `.trim();
  }
}
