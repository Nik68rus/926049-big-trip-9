import {
  SiteMenu,
  Filter,
  Statistic,
  API,
} from './components';

import TripController from './controllers/trip';
import {render, Position} from './util/dom';
import {AUTHORIZATION, END_POINT} from './constants';

const pageMainContainer = document.querySelector(`.page-main .page-body__container`);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const statistics = new Statistic([]);

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
      statistics.update(tripController._events);
      statistics.getElement().classList.remove(`visually-hidden`);
      tripFilters.classList.add(`visually-hidden`);
      sorting.classList.add(`visually-hidden`);
      tripController.hide();
      break;
  }
};

const onAddEventBtnClick = () => {
  tripController.createEvent(api.getNewID);
};

const onDataChange = (actionType, update) => {
  switch (actionType) {
    case `delete`:
      api.deletePoint({
        id: update.id
      })
        .then(() => api.getPoints())
        .then((points) => tripController.init(points));
      break;
    case `update`:
      api.updatePoint({
        id: update.id,
        point: update,
      })
        .then(() => api.getPoints())
        .then((points) => tripController.init(points));
      break;
    case `create`:
      api.createPoint(update)
        .then(() => api.getPoints())
        .then((points) => tripController.init(points));
      break;
  }
};

const tripController = new TripController(tripEvents, [], onDataChange);

renderMenuWrapper();
menuElements.forEach(renderMenu);

const menu = document.querySelector(`.trip-controls__trip-tabs`);
menu.addEventListener(`click`, onMenuClick);

renderFilterWrapper();
filterElements.forEach(renderFilter);

api.getOffers().then((offers) => tripController.getOffers(offers));
api.getDestinations().then((destinations) => tripController.getDestinations(destinations));
api.getPoints().then((points) => tripController.init(points));

render(pageMainContainer, statistics.getElement(), Position.BEFOREEND);
statistics.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, onAddEventBtnClick);
