import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const createFilmCardTemplate = (cardItem) => {
  const {filmInfo, release, userDetails} = cardItem;


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
    <p class="film-card__description">${filmInfo.description}</p>
    <span class="film-card__comments">18 comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item ${watchlistClassName}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item ${watchedClassName}" type="button">Mark as watched</button>
    <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
  </div>
  </article>`;
};
