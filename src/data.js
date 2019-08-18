import {PLACE_TYPES, ACTION_TYPES, CITIES, DESCRIPTION, OPTIONS, MAX_PRICE, EVENT_COUNT, IMAGE_MAX_AMOUNT} from './constants';

export const getEvent = () => {
  const time = Date.now() - Math.random() * 24 * 60 * 60 * 1000;
  return {
    type: PLACE_TYPES.concat(ACTION_TYPES)[Math.floor(Math.random() * (PLACE_TYPES.length + ACTION_TYPES.length))],
    city: CITIES[Math.floor(Math.random() * CITIES.length)],
    description: [...new Set([
      DESCRIPTION[Math.floor(Math.random() * DESCRIPTION.length)],
      DESCRIPTION[Math.floor(Math.random() * DESCRIPTION.length)],
      DESCRIPTION[Math.floor(Math.random() * DESCRIPTION.length)],
    ])].slice(0, Math.floor(Math.random() * 3)).join(` `),
    images: new Array(Math.floor(Math.random() * IMAGE_MAX_AMOUNT)).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`),
    time: {
      start: time,
      end: time + Math.random() * 48 * 60 * 60 * 1000,
    },
    price: Math.floor(Math.random() * MAX_PRICE),
    offers: [...new Set([
      OPTIONS[Math.floor(Math.random() * 4)],
      OPTIONS[Math.floor(Math.random() * 4)],
      OPTIONS[Math.floor(Math.random() * 4)],
    ])].slice(0, Math.floor(Math.random() * 3)),
    isFavorite: Boolean(Math.round(Math.random())),
  };
};

export const eventList = new Array(EVENT_COUNT).fill(``).map(getEvent);

const reducer = (acc, it) => acc + it;

const getItemOffersPrice = (offer) => offer.map((item) => item.isAdded ? item.price : 0).reduce(reducer, 0);

export const countPrice = (list) => list.map((item) => item.price + getItemOffersPrice(item.offers)).reduce(reducer);
