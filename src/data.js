import {TYPES, CITIES, DESCRIPTION, OPTIONS, MAX_PRICE, EVENT_COUNT} from './constants';

export const getEvent = () => ({
  type: TYPES[Math.floor(Math.random() * TYPES.length)],
  city: CITIES[Math.floor(Math.random() * CITIES.length)],
  description: [...new Set([
    DESCRIPTION[Math.floor(Math.random() * DESCRIPTION.length)],
    DESCRIPTION[Math.floor(Math.random() * DESCRIPTION.length)],
    DESCRIPTION[Math.floor(Math.random() * DESCRIPTION.length)],
  ])].slice(0, 1 + Math.floor(Math.random() * 3)).join(` `),
  timeStart: Date.now() - Math.random() * 12 * 60 * 60 * 1000,
  duration: Math.random() * 6 * 60 * 60 * 1000,
  price: Math.floor(Math.random() * MAX_PRICE),
  offers: [...new Set([
    OPTIONS[Math.floor(Math.random() * 4)],
    OPTIONS[Math.floor(Math.random() * 4)],
    OPTIONS[Math.floor(Math.random() * 4)],
  ])].slice(0, Math.floor(Math.random() * 3)),
  isFavorite: Boolean(Math.round(Math.random())),
});

export const eventList = new Array(EVENT_COUNT).fill(``).map(getEvent);
