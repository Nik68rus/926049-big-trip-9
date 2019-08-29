import AbstractComponent from './abstarct-component';
import {formatDateDay, formatDateMarkup} from './date-formater';

export default class DaySchedule extends AbstractComponent {
  constructor(events) {
    super();
    this._date = events.length === 0 ? 0 : events[0].time.start;
  }

  getTemplate() {
    return `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="${formatDateMarkup(this._date)}">${formatDateDay(this._date)}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
    </li>
    `.trim();
  }
}
