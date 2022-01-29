import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import AbstractView from './abstract-view.js';
dayjs.extend(duration);

const MAX_SYMBOL=140;

const createFilmCardTemplate = (cardItem) => {
  const {comments, filmInfo, release, userDetails} = cardItem;


  const hours = Math.floor(dayjs.duration(filmInfo.runTime, 'minutes').asHours(filmInfo.runTime));
  const minutes = dayjs.duration(filmInfo.runTime, 'minutes').minutes(filmInfo.runTime);
  const timeDuration = (hours===0) ?  `${minutes}m` : `${hours}h ${minutes}m`;

  const releaseYear = dayjs(release.date).format('YYYY');

  const favoriteClassName = userDetails.isFavorite
    ? 'film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  const watchedClassName = userDetails.isAlreadyWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  const watchlistClassName = userDetails.isWatchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${timeDuration}</span>
      <span class="film-card__genre">${filmInfo.genre[0]}</span>
    </p>
    <img src="${filmInfo.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${filmInfo.description.length > MAX_SYMBOL ?
    `${filmInfo.description.substring(0, MAX_SYMBOL-1)} ...` : `${filmInfo.description}`}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item ${watchlistClassName}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item ${watchedClassName}" type="button">Mark as watched</button>
    <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
  </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  #card = null;

  constructor(card) {
    super();
    this.#card = card;
  }

  get template() {
    return createFilmCardTemplate(this.#card);
  }

  setClickFilmHandler = (callback) => {
    this._callback.clickFilm = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', (evt) => this.#filmClickHandler(evt, this.#card.id));
  }

  setClickButtonWatchlist = (callback) => {
    this._callback.clickWatchlist = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setClickButtonWatched = (callback) => {
    this._callback.clickWatched = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setClickButtonFavorites = (callback) => {
    this._callback.clickFavorites = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoritesClickHandler);
  }

  #filmClickHandler = (evt, id) => {
    evt.preventDefault();
    this._callback.clickFilm(id);
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickWatchlist();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickWatched();
  }

  #favoritesClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickFavorites();
  }
}
