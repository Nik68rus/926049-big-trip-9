const titleReducer = (a, b) => b.length > a.length ? b : a;

export default class ModelPoint {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.city = data.destination.name;
    this.description = data.destination.description;
    this.images = data.destination.pictures;
    this.time = {
      start: new Date(data.date_from),
      end: new Date(data.date_to),
    };
    this.price = data.base_price;
    this.offers = data.offers.map((offer) => {
      return {
        name: offer.title.split(` `).reduce(titleReducer),
        title: offer.title,
        price: offer.price,
        isAdded: offer.accepted,
      };
    });
    this.isFavorite = data.is_favorite;
  }

  static parsePoint(data) {
    console.log(data);
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}

