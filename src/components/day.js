import {formatDateDay, formatDateMarkup} from './date-formater';

export const getDayMarkup = (date) => {
  return `
  <ul class="trip-days">
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">1</span>
        <time class="day__date" datetime="${formatDateMarkup(date)}">${formatDateDay(date)}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
    </li>
  </ul>
  `;
};
