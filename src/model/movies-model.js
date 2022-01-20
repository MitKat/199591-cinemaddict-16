import AbstractObservable from '../utils/abstract-observable.js';

export default class MoviesModel extends AbstractObservable {
  #movies = [];

  set movies(movies) {
    this.#movies = [...movies];
  }

  get movies() {
    return this.#movies;
  }

  updateFilm = (updateType, update) => {
    const index = this.#movies.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addFilm = (updateType, update) => {
    this.#movies = [
      update,
      ...this.#movies,
    ];

    this._notify(updateType, update);
  }

  deleteFilm = (updateType, update) => {
    const index = this.#movies.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
