import {getRandomBool} from './util/tools';

export const CITIES = [
  `Asterdam`,
  `Brusseles`,
  `Barcelona`,
  `Cologne`,
];

export const PLACE_TYPES = [
  `Check-in`,
  `Restaurant`,
  `Sightseeing`,
];

export const ACTION_TYPES = [
  `Bus`,
  `Drive`,
  `Flight`,
  `Ship`,
  `Taxi`,
  `Train`,
  `Transport`,
]
;
export const SENTENCES = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

export const OPTIONS = [
  {
    name: `lagguage`,
    title: `Add lagguage`,
    price: 10,
    isAdded: getRandomBool(),
  },
  {
    name: `comfort`,
    title: `Switch to comfort class`,
    price: 150,
    isAdded: getRandomBool(),
  },
  {
    name: `meal`,
    title: `Add meal`,
    price: 2,
    isAdded: getRandomBool(),
  },
  {
    name: `seats`,
    title: `Choose seats`,
    price: 9,
    isAdded: getRandomBool(),
  }
];

export const Time = {
  DAY: 24 * 60 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  MINUTE: 60 * 1000,
};

export const MAX_DURATION = Time.DAY * 2;
export const MIN_PRICE = 5;
export const MAX_PRICE = 300;
export const EVENT_NUM = 4;
export const IMAGE_MAX_NUM = 7;
export const MAX_SENTENCES_NUM = 3;
export const MAX_OPTIONS_NUM = 2;
