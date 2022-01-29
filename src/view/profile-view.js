import SmartView from './smart-view.js';
import {generateProfileRank} from '../utils/common.js';

const createProfileTemplate = (movies) => {
  const watchedMovies = movies.filter((film) => film.userDetails.isAlreadyWatched);
  const profileName = generateProfileRank(watchedMovies.length);

  return (`<section class="header__profile profile">
  <p class="profile__rating">${profileName}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class ProfileView extends SmartView {
  #moviesModel = null;

  constructor(moviesModel) {
    super();
    this.#moviesModel = moviesModel;
    this.#moviesModel.addObserver(this.#handleModelEvent);
  }

  restoreHandlers = () => {}

  get template() {
    return createProfileTemplate(this.#moviesModel.movies);
  }

  #handleModelEvent = () => {
    this.updateElement();
  }
}
