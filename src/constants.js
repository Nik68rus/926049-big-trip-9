export const Time = {
  DAY: 24 * 60 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  MINUTE: 60 * 1000,
};

export const menuElements = [
  {name: `Table`, isActive: true},
  {name: `Stats`},
];

export const filterElements = [
  {name: `Everything`, isChecked: true},
  {name: `Future`},
  {name: `Past`},
];

export const PLACE_TYPES = [
  `check-in`,
  `restaurant`,
  `sightseeing`,
];

export const ACTION_TYPES = [
  `bus`,
  `drive`,
  `flight`,
  `ship`,
  `taxi`,
  `train`,
  `transport`,
];

export const TypeEmoji = {
  bus: `🚌`,
  drive: `🚗`,
  flight: `✈️`,
  ship: `🚢`,
  taxi: `🚕`,
  train: `🚆`,
  transport: `🚘`,
  [`check-in`]: `🏨`,
  restaurant: `🍽️`,
  sightseeing: `🗿`,
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

export const SortType = {
  PRICE: `price`,
  TIME: `time`,
  EVENT: `event`,
};

export const FilterType = {
  EVERYTHING: `filter-everything`,
  FUTURE: `filter-future`,
  PAST: `filter-past`,
};

export const chartMaxHeight = `200px`;

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
export const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip`;

export const ANIMATION_TIMEOUT = 600;

export const StoreKey = {
  POINTS: `points`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`,
};


