import {Method} from '../constants';
import ModelPoint from './model-point';
import ModelDestination from './model-destination';
import ModelOffer from './model-offer';

const URL = {
  DESTINATIONS: `destinations`,
  POINTS: `points`,
  OFFERS: `offers`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: URL.POINTS})
    .then(toJSON)
    .then(ModelPoint.parsePoints);
  }

  createPoint({point}) {
    return this._load({
      url: URL.POINTS,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `${URL.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  deletePoint({id}) {
    return this._load({url: `${URL.POINTS}/${id}`, method: Method.DELETE});
  }

  getDestinations() {
    return this._load({url: URL.DESTINATIONS})
    .then(toJSON)
    .then(ModelDestination.parseDestinations);
  }

  getOffers() {
    return this._load({url: URL.OFFERS})
    .then(toJSON)
    .then(ModelOffer.parseOffers);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}
