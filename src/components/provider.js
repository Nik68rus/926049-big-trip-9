import {toRAW} from '../util/tools';
import ModelPoint from './model-point';

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.forEach((it) => this._store.setItem({key: it.id, item: toRAW(it)}));
          return points;
        });
    } else {
      const rawPointsMap = this._store.getAll();
      const rawPoints = objectToArray(rawPointsMap);
      const points = ModelPoint.parsePoints(rawPoints);
      return Promise.resolve(points);
    }
  }

  createPoint(point) {
    if (this._isOnline()) {
      return this._api.createPoint(point)
        .then((curPoint) => {
          this._store.setItem({key: curPoint.id, item: curPoint});
          return curPoint;
        });
    } else {
      this._store.setItem({key: point.id, item: toRAW(point)});
      return Promise.resolve(point);
    }
  }

  updatePoint({id, point}) {
    if (this._isOnline()) {
      return this._api.updatePoint({id, point})
        .then((curPoint) => {
          this._store.setItem({key: curPoint.id, item: curPoint});
          return curPoint;
        });
    } else {
      const curPoint = point;
      this._store.setItem({key: curPoint.id, item: toRAW(curPoint)});
      return Promise.resolve(curPoint);
    }
  }

  deletePoint({id}) {
    if (this._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  syncPoints() {
    return this._api.syncPoints({points: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
