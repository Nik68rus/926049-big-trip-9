const titleReducer = (a, b) => b.length > a.length ? b : a;

export default class ModelOffer {
  constructor(data) {
    this.name = data.type;
    this.offers = data.offers.map((offer) => {
      return {
        name: offer.name.split(` `).reduce(titleReducer),
        title: offer.name,
        price: offer.price,
        isAdded: false,
      };
    });
  }

  static parseOffer(data) {
    return new ModelOffer(data);
  }

  static parseOffers(data) {
    return data.map(ModelOffer.parseOffer);
  }
}
