import {Time, PLACE_TYPES, ACTION_TYPES} from './constants';

const getRandomBool = (chance = 0.5) =>
  Math.random() > chance;

export const CITIES = [
  `Amsterdam`,
  `Brusseles`,
  `Barcelona`,
  `Cologne`,
];

const SENTENCES = [
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

const OPTIONS = [
  {
    name: `lagguage`,
    title: `Add lagguage`,
    price: 10,
    isAdded: false,
  },
  {
    name: `comfort`,
    title: `Switch to comfort class`,
    price: 150,
    isAdded: false,
  },
  {
    name: `meal`,
    title: `Add meal`,
    price: 2,
    isAdded: false,
  },
  {
    name: `seats`,
    title: `Choose seats`,
    price: 9,
    isAdded: false,
  }
];

const MAX_DURATION = Time.DAY * 2;
const MIN_PRICE = 5;
const MAX_PRICE = 300;
const EVENT_NUM = 10;
const IMAGE_MAX_NUM = 7;
const MAX_SENTENCES_NUM = 3;
const MAX_OPTIONS_NUM = 2;


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

export const CitiesWithDescription = CITIES.map((city) => {
  return {
    name: city,
    description: getRandomSet(SENTENCES, getRandomNumber(0, MAX_SENTENCES_NUM)).join(` `),
  };
});

export const TypeOffers = PLACE_TYPES.concat(ACTION_TYPES).map((type) => {
  return {
    name: type,
    offers: getRandomSet(OPTIONS, getRandomNumber(0, MAX_OPTIONS_NUM)),
  };
});


const getEvent = () => {
  const time = Date.now() - Math.random() * Time.DAY * 7;
  const city = getRandomItem(CitiesWithDescription);
  const type = getRandomItem(TypeOffers);
  return {
    type: type.name,
    city: city.name,
    description: city.description,
    images: getImageURLs(getRandomNumber(0, IMAGE_MAX_NUM)),
    time: {
      start: time,
      end: time + Math.random() * MAX_DURATION,
    },
    price: getRandomNumber(MIN_PRICE, MAX_PRICE),
    offers: type.offers,
    isFavorite: getRandomBool(),
  };
};

const getEvents = (num = EVENT_NUM) => {
  const events = Array.from({length: num}, getEvent);
  events.forEach((event) => {
    event.offers.forEach((offer) => {
      offer.isAdded = getRandomBool(); // почему-то работает некорректно, все равно у одинаковых типов добавлены одни и те же опции
    });
  });
  return events;
};

export const Mock = {
  load: getEvents,
};

