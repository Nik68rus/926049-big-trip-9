const Style = {
  VISUALLY_HIDDEN: `visually-hidden`,
};

export const makeFirstCharCapital = (word) => word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ``;
export const compareEventsByTime = (a, b) => a.time.start - b.time.start;

export const hideIfTrue = (element, isHide) =>
  element.classList[isHide ? `add` : `remove`](Style.VISUALLY_HIDDEN);

export const toRAW = (point) => {
  return {
    'base_price': point.price,
    'date_from': point.time.start,
    'date_to': point.time.end,
    'destination': {
      description: point.description,
      name: point.city,
      pictures: point.images,
    },
    'id': point.id,
    'is_favorite': point.isFavorite,
    'offers': point.offers.map((offer) => {
      return {
        accepted: offer.isAdded,
        price: offer.price,
        title: offer.title,
      };
    }),
    'type': point.type,
  };
};

export const destinationToRaw = (destination) => {
  return {
    name: destination.name,
    description: destination.description,
    pictures: destination.images,
  };
};

export const offersToRAW = (types) => {
  return {
    type: types.name,
    offers: types.offers.map((offer) => {
      return {
        name: offer.title,
        price: offer.price,
      };
    })
  };
};

