import {makeMarkupGenerator} from '../util/dom';

const getMenuItemMarkup = ({name, isActive = false} = {}) => {
  return `
  <a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${name}</a>
  `;
};

const getMenuMarkup = makeMarkupGenerator(getMenuItemMarkup, `\n`);

export const getMenuWrappedMarkup = (elements) => `
  <nav class="trip-controls__trip-tabs  trip-tabs">
    ${getMenuMarkup(elements)}
  </nav>
`.trim();

