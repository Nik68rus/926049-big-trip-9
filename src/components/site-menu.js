import {getMarkup} from './util';

const getMenuItemMarkup = ({name, isActive = false} = {}) => {
  return `
  <a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>
  `;
};

const getMenuMarkup = (data) => getMarkup(data, getMenuItemMarkup);

export const getMenuWrappedMarkup = (elements) => {
  return `
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${getMenuMarkup(elements)}
    </nav>
  `.trim();
};

