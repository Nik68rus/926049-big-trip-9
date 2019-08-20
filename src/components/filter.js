import {makeMarkupGenerator} from '../util/dom';

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
