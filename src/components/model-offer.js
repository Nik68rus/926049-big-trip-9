export default class ModelOffer {
  constructor(data) {
    this.name = data.type;
    this.offers = data.offers.map((offer) => {
      return {
        name: offer.name.split(` `).join(`-`).toLowerCase(),
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
