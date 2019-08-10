import {getMenuMarkup} from './components/site-menu';
import {getFilterMarkup} from './components/filter';
import {getRouteMarkup} from './components/route';
import {getSortingMarkup} from './components/sorting';
import {getContentMarkup} from './components/content';

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripInfo = document.querySelector(`.trip-main__trip-info`);
const tripEvents = document.querySelector(`.trip-events`);

const renderComponent = (container, component, position) => {
  container.insertAdjacentHTML(position, component);
};

renderComponent(tripInfo, getRouteMarkup(), `afterbegin`);
renderComponent(tripControls, getMenuMarkup(), `afterbegin`);
renderComponent(tripControls, getFilterMarkup(), `beforeend`);
renderComponent(tripEvents, getSortingMarkup(), `beforeend`);
renderComponent(tripEvents, getContentMarkup(), `beforeend`);

