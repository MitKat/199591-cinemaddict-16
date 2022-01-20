import FilmCardView from '../view/film-card-view';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';

export default class FilmPresenter {
  #filmContainer = null;
  #movie = {};
  #changeData = null;
  #popupOpen = null;
  #filmComponent = null;

  constructor (filmContainer, changeData, popupOpen) {
    this.#filmContainer = filmContainer;
    this.#changeData = changeData;
    this.#popupOpen = popupOpen;
  }

  init = (movie) => {
    this.#movie = movie;

    this.#filmComponent = new FilmCardView(movie);
    this.#filmComponent.setClickFilmHandler(this.#popupOpen);
    this.#filmComponent.setClickButtonWatchlist(this.#handleWatchlistClick);
    this.#filmComponent.setClickButtonWatched(this.#handleWatchedClick);
    this.#filmComponent.setClickButtonFavorites(this.#handleFavoritesClick);

    render(this.#filmContainer, this.#filmComponent, RenderPosition.BEFOREEND);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {
        ...this.#movie.userDetails,
        isWatchlist: !this.#movie.userDetails.isWatchlist
      }});
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {
        ...this.#movie.userDetails,
        isAlreadyWatched: !this.#movie.userDetails.isAlreadyWatched
      }});
  }

  #handleFavoritesClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {
        ...this.#movie.userDetails,
        isFavorite: !this.#movie.userDetails.isFavorite
      }});
  }
}
