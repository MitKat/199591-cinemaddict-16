import AbstractView from './abstract-view.js';
import {generateProfileRank} from '../utils/common.js';

const createProfileTemplate = (movies) => {
  const Item = movies.filter((film) => film.userDetails.isAlreadyWatched);
  const profileName = generateProfileRank(Item.length);

  return (`<section class="header__profile profile">
  <p class="profile__rating">${profileName}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class ProfileView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createProfileTemplate(this.#movies);
  }
}
