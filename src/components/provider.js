import {toRAW} from '../util/tools';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    return this._api.getPoints()
      .then((points) => {
        points.forEach((it) => this._store.setItem({key: it.id, item: toRAW(it)}));
        return points;
      });
  }

  createPoint(point) {
    return this._api.createPoint(point)
      .then((curPoint) => {
        this._store.setItem({key: curPoint.id, item: curPoint});
        return curPoint;
      });
  }

  updatePoint({id, point}) {
    return this._api.updatePoint({id, point})
      .then((curPoint) => {
        this._store.setItem({key: curPoint.id, item: curPoint});
        return curPoint;
      });
  }

  deletePoint({id}) {
    return this._api.deletePoint({id})
      .then(() => {
        this._store.removeItem({key: id});
      });
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }
}
