import {
  getMenuWrappedMarkup,
  getFilterFormMarkup,
  getSortingMarkup,
  getRouteMarkup,
  getContentMarkup,
  renderComponent,
} from './components';

const menuElements = [
  {name: `Table`, isActive: true},
  {name: `Stats`},
];

const filterElements = [
  {name: `Everything`, isChecked: true},
  {name: `Future`},
  {name: `Past`},
];

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripEvents = document.querySelector(`.trip-events`);

renderComponent(tripInfo, getRouteMarkup(), `afterbegin`);
renderComponent(tripControls, getMenuWrappedMarkup(menuElements), `afterbegin`);
renderComponent(tripControls, getFilterFormMarkup(filterElements), `beforeend`);
renderComponent(tripEvents, getSortingMarkup(), `beforeend`);
renderComponent(tripEvents, getContentMarkup(), `beforeend`);

