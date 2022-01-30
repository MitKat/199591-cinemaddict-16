import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../utils/const.js';

export default class MoviesModel extends AbstractObservable {
  #apiService = null;
  #movies = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get movies() {
    return this.#movies;
  }

  init = async () => {
    try{
      const movies = await this.#apiService.movies;
      this.#movies = movies.map(this.#adaptToClient);

    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#movies.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateMovie(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        updatedFilm,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error('Can\'t update film');
    }
  }

  #adaptToClient = (movie) => {
    const adaptedMovie = {...movie,
      ...movie.release, release: {
        ...movie.film_info['release'],
        country: movie.film_info.release['release_country'],
      },
      ...movie.filmInfo, filmInfo: {
        ...movie.film_info,
        ageRating: movie.film_info['age_rating'],
        alternativeTitle: movie.film_info['alternative_title'],
        runTime: movie.film_info['runtime'],
        totalRating: movie.film_info['total_rating'],
      },
      ...movie.userDetails, userDetails: {
        isAlreadyWatched: movie.user_details['already_watched'],
        isFavorite: movie.user_details['favorite'],
        isWatchlist: movie.user_details['watchlist'],
        watchingDate: movie.user_details['watching_date'],
      }
    };

    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];
    delete adaptedMovie.filmInfo['age_rating'];
    delete adaptedMovie.filmInfo['alternative_title'];
    delete adaptedMovie.filmInfo['runtime'];
    delete adaptedMovie.filmInfo['total_rating'];
    delete adaptedMovie.userDetails['already_watched'];
    delete adaptedMovie.userDetails['favorite'];
    delete adaptedMovie.userDetails['watchlist'];
    delete adaptedMovie.userDetails['watching_date'];
    delete adaptedMovie.release['release_country'];

    return adaptedMovie;
  }
}
