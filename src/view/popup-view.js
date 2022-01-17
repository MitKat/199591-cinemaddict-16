// import AbstractView from './abstract-view.js';
import SmartView from './smart-view.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const createPopupTemplate = (cardItem) => {
  const {filmInfo, release, userDetails} = cardItem;

  const hours = Math.floor(dayjs.duration(filmInfo.runTime, 'minutes').asHours(filmInfo.runTime));
  const minutes = dayjs.duration(filmInfo.runTime, 'minutes').minutes(filmInfo.runTime);
  const timeDuration = (hours===0) ?  `${minutes}m` : `${hours}h ${minutes}m`;

  const releaseDate = dayjs(release.date).format('DD MMMM YYYY');

  let titleGenre = 'Genres';
  const listGenre = [];
  if (filmInfo.genre.length === 1) {
    titleGenre = 'Genre';
    listGenre[0] = `<span class="film-details__genre">${filmInfo.genre[0]}</span>`;
  } else {
    for (let i=0; i<filmInfo.genre.length; i++) {
      listGenre[i] = `<span class="film-details__genre">${filmInfo.genre[i]}</span>`;
    }
  }

  const favoriteClassName = userDetails.isFavorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  const watchedClassName = userDetails.isAlreadyWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const watchlistClassName = userDetails.isWatchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

          <p class="film-details__age">${filmInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${releaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${timeDuration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${titleGenre}</td>
              <td class="film-details__cell">
                ${listGenre.join(' ')}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
          ${filmInfo.description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${watchedClassName}" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">

    </div>
  </form>
</section>`;
};

export default class PopupView extends SmartView {
  #cardItem = null;

  constructor(cardItem) {
    super();
    this.#cardItem = cardItem;
  }

  get template() {
    return createPopupTemplate(this.#cardItem);
  }

  setClosePopupHandler = (callback) => {
    this._callback.popupCLoseCLick = callback;
    this.element.querySelector('.film-details__close').addEventListener('click', this.#popupCloseHandler);
  }

  setClickButtonPopupWatchlist = (callback) => {
    this._callback.clickPopupWatchlist = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickPopupHandler);
  }

  setClickButtonPopupWatched = (callback) => {
    this._callback.clickPopupWatched = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickPopupHandler);
  }

  setClickButtonPopupFavorites = (callback) => {
    this._callback.clickPopupFavorites = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoritesClickPopupHandler);
  }

  #popupCloseHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupCLoseCLick();
  }

  #watchlistClickPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickPopupWatchlist();
  }

  #watchedClickPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickPopupWatched();
  }

  #favoritesClickPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickPopupFavorites();
  }

}

