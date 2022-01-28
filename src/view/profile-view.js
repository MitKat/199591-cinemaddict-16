import AbstractView from './abstract-view.js';
import {generateProfileRank} from '../utils/common.js';

const createProfileTemplate = (movies) => {
  const profileName = generateProfileRank(movies.length);

  return (`<section class="header__profile profile">
  <p class="profile__rating">${profileName}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class ProfileView extends AbstractView {
  #watchedMovies = null;

  constructor(movies) {
    super();
    this.#watchedMovies = movies.filter((film) => film.userDetails.isAlreadyWatched);
  }

  get template() {
    return createProfileTemplate(this.#watchedMovies);
  }
}
