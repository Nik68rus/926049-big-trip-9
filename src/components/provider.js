import {toRAW, destinationToRaw, offersToRAW} from '../util/tools';
import ModelPoint from './model-point';
import ModelDestination from './model-destination';
import ModelOffer from './model-offer';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._pointsStorage = store.points;
    this._offersStorage = store.offers;
    this._destinationsStorage = store.destinations;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.forEach((it) => this._pointsStorage.setItem({key: it.id, item: toRAW(it)}));
          return points;
        });
    } else {
      const rawPointsMap = this._pointsStorage.getAll();
      const rawPoints = objectToArray(rawPointsMap);
      const points = ModelPoint.parsePoints(rawPoints);
      return Promise.resolve(points);
    }
  }

  createPoint(point) {
    if (this._isOnline()) {
      return this._api.createPoint(point)
        .then((curPoint) => {
          this._pointsStorage.setItem({key: curPoint.id, item: curPoint});
          return curPoint;
        });
    } else {
      this._pointsStorage.setItem({key: point.id, item: toRAW(point)});
      return Promise.resolve(point);
    }
  }

  updatePoint({id, point}) {
    if (this._isOnline()) {
      return this._api.updatePoint({id, point})
        .then((curPoint) => {
          this._pointsStorage.setItem({key: curPoint.id, item: curPoint});
          return curPoint;
        });
    } else {
      const curPoint = point;
      this._pointsStorage.setItem({key: curPoint.id, item: toRAW(curPoint)});
      return Promise.resolve(curPoint);
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._pointsStorage.removeItem({key: id});
        });
    } else {
      this._pointsStorage.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getDestinations() {
    if (this._isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          destinations.forEach((it) => this._destinationsStorage.setItem({key: it.name, item: destinationToRaw(it)}));
          return destinations;
        });
    } else {
      const rawDestinationsMap = this._destinationsStorage.getAll();
      const rawDestinations = objectToArray(rawDestinationsMap);
      const destinations = ModelDestination.parseDestinations(rawDestinations);
      return Promise.resolve(destinations);
    }
  }

  getOffers() {
    if (this._isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          offers.forEach((it) => this._offersStorage.setItem({key: it.name, item: offersToRAW(it)}));
          return offers;
        });
    } else {
      const rawOffersMap = this._offersStorage.getAll();
      const rawOffers = objectToArray(rawOffersMap);
      const offers = ModelOffer.parseOffers(rawOffers);
      return Promise.resolve(offers);
    }
  }

  syncPoints() {
    return this._api.syncPoints({points: objectToArray(this._pointsStorage.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
