import {
  SiteMenu,
  Filter,
  LoadingMessage,
  Statistic,
  API,
  Provider,
  Store,
} from './components';

import TripController from './controllers/trip';
import {render, Position} from './util/dom';
import {menuElements, filterElements, AUTHORIZATION, END_POINT, StoreKey} from './constants';

const pageMainContainer = document.querySelector(`.page-main .page-body__container`);
const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const addBtn = document.querySelector(`.trip-main__event-add-btn`);


const loadingMessage = new LoadingMessage();
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = {
  points: new Store({storage: window.localStorage, key: StoreKey.POINTS}),
  offers: new Store({storage: window.localStorage, key: StoreKey.OFFERS}),
  destinations: new Store({storage: window.localStorage, key: StoreKey.DESTINATIONS}),
};
const provider = new Provider(api, store);
const statistics = new Statistic([]);

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
      tripController.initSorting();
      tripController.show();
      addBtn.disabled = false;
      tripController.renderEmptyMessage();
      break;
    case `Stats`:
      statistics.update(tripController._events);
      statistics.getElement().classList.remove(`visually-hidden`);
      tripFilters.classList.add(`visually-hidden`);
      sorting.classList.add(`visually-hidden`);
      tripController.hide();
      addBtn.disabled = true;
      tripController.removeEmptyMessage();
      break;
  }
};

const onAddEventBtnClick = () => {
  tripController.removeEmptyMessage();
  tripController.createEvent();
};

const onDataChange = (editingPoint, actionType, update) => {
  const onError = () => {
    editingPoint.shakeRed();
  };

  editingPoint.block();

  switch (actionType) {
    case `delete`:
      provider.deletePoint({
        id: update.id
      })
        .then(() => provider.getPoints())
        .then((points) => tripController.update(points))
        .catch(onError);
      break;
    case `update`:
      provider.updatePoint({
        id: update.id,
        point: update,
      })
        .then(() => provider.getPoints())
        .then((points) => tripController.update(points))
        .catch(onError);
      break;
    case `create`:
      provider.createPoint(update)
        .then(() => provider.getPoints())
        .then((points) => tripController.update(points))
        .catch(onError);
      break;
  }
};

const tripController = new TripController(tripEvents, [], onDataChange);

if (!window.navigator.onLine) {
  document.title = `${document.title}[OFFLINE]`;
}

render(tripEvents, loadingMessage.getElement(), Position.AFTERBEGIN);

renderMenuWrapper();
menuElements.forEach(renderMenu);
const menu = document.querySelector(`.trip-controls__trip-tabs`);
menu.addEventListener(`click`, onMenuClick);

renderFilterWrapper();
filterElements.forEach(renderFilter);

provider.getOffers().then((offers) => tripController.getOffers(offers));
provider.getDestinations().then((destinations) => {
  tripController.getDestinations(destinations);
  provider.getPoints().then((points) => {
    tripEvents.removeChild(loadingMessage.getElement());
    tripController.init(points);
  });
});

render(pageMainContainer, statistics.getElement(), Position.BEFOREEND);
statistics.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, onAddEventBtnClick);

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncPoints()
    .then(tripController.updateView());
});

