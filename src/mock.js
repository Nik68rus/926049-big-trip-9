import {
  PLACE_TYPES,
  ACTION_TYPES,
  CITIES,
  SENTENCES,
  OPTIONS,
  MAX_OPTIONS_NUM,
  MIN_PRICE,
  MAX_PRICE,
  EVENT_NUM,
  IMAGE_MAX_NUM,
  MAX_SENTENCES_NUM,
  MAX_DURATION,
  Time,
} from './constants';

import {getRandomBool} from './util/tools';

const getRandomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomNumber = (min = 0, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomSorting = () =>
  Math.random() - 0.5;

const getRandomSet = ([...items], num) =>
  items.sort(getRandomSorting).slice(0, num);

const getImageURL = () =>
  `http://picsum.photos/300/150?r=${Math.random()}`;

const getImageURLs = (num = IMAGE_MAX_NUM) =>
  Array.from({length: num}, getImageURL);

const getEvent = () => {
  const time = Date.now() - Math.random() * Time.DAY;
  return {
    type: getRandomItem(PLACE_TYPES.concat(ACTION_TYPES)),
    city: getRandomItem(CITIES),
    description: getRandomSet(SENTENCES, getRandomNumber(0, MAX_SENTENCES_NUM)).join(` `),
    images: getImageURLs(getRandomNumber(0, IMAGE_MAX_NUM)),
    time: {
      start: time,
      end: time + Math.random() * MAX_DURATION,
    },
    price: getRandomNumber(MIN_PRICE, MAX_PRICE),
    offers: getRandomSet(OPTIONS, getRandomNumber(0, MAX_OPTIONS_NUM)),
    isFavorite: getRandomBool(),
  };
};

const getEvents = (num = EVENT_NUM) =>
  Array.from({length: num}, getEvent);

export const Mock = {
  load: getEvents,
};

