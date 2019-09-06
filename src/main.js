import {
  SiteMenu,
  Filter,
  Statistic,
} from './components';

import TripController from './controllers/trip';
import {render, Position} from './util/dom';
import {Mock} from './mock';

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const statistics = new Statistic();

const menuElements = [
  {name: `Table`, isActive: true},
  {name: `Stats`},
];

const filterElements = [
  {name: `Everything`, isChecked: true},
  {name: `Future`},
  {name: `Past`},
];

const renderFilterWrapper = () => {
  const filterWrapper = `
  <form class="trip-filters" action="#" method="get">
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`.trim();
  tripControls.insertAdjacentHTML(Position.BEFOREEND, filterWrapper);
};

const renderFilter = (filterType) => {
  const tripFilters = tripControls.querySelector(`.trip-filters`);
  const filter = new Filter(filterType);
  render(tripFilters, filter.getElement(), Position.BEFOREEND);
};

const renderMenuWrapper = () => {
  const menuWrapper = `
  <nav class="trip-controls__trip-tabs  trip-tabs">
  </nav>
`.trim();
  tripControls.insertAdjacentHTML(Position.AFTERBEGIN, menuWrapper);
};

const renderMenu = (menuItem) => {
  const menuContainer = tripControls.querySelector(`.trip-controls__trip-tabs`);
  const menu = new SiteMenu(menuItem);
  render(menuContainer, menu.getElement(), Position.BEFOREEND);
};

const onMenuClick = (evt) => {
  const tripFilters = document.querySelector(`.trip-filters`);
  const sorting = document.querySelector(`.trip-sort`);

  evt.preventDefault();

  if (evt.target.tagName.toLowerCase() !== `a`) {
    return;
  }

  menu.querySelectorAll(`.trip-tabs__btn`).forEach((it) => {
    it.classList.remove(`trip-tabs__btn--active`);
  });
  evt.target.classList.add(`trip-tabs__btn--active`);

  switch (evt.target.textContent) {
    case `Table`:
      statistics.getElement().classList.add(`visually-hidden`);
      tripFilters.classList.remove(`visually-hidden`);
      sorting.classList.remove(`visually-hidden`);
      tripController.show();
      break;
    case `Stats`:
      statistics.getElement().classList.remove(`visually-hidden`);
      tripFilters.classList.add(`visually-hidden`);
      sorting.classList.add(`visually-hidden`);
      tripController.hide();
      break;
  }
};

const events = Mock.load();

renderMenuWrapper();
menuElements.forEach(renderMenu);

const menu = document.querySelector(`.trip-controls__trip-tabs`);
menu.addEventListener(`click`, onMenuClick);

renderFilterWrapper();
filterElements.forEach(renderFilter);

const tripController = new TripController(tripEvents, events);
tripController.init();
