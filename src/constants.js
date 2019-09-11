export const Time = {
  DAY: 24 * 60 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  MINUTE: 60 * 1000,
};

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
