import AbstractView from './abstract-view.js';
import {generateProfileRank} from '../utils/common.js';
import {FilterType} from '../utils/const.js';
import {filter} from '../utils/filter.js';

const createProfileTemplate = (movies) => {
  const Item = filter[FilterType.HISTORY](movies);
  const profileName = generateProfileRank(Item.length);

  return (`<section class="header__profile profile">
  <p class="profile__rating">${profileName}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class ProfileView extends AbstractView {
  #moviesModel = null;

  constructor(moviesModel) {
    super();
    this.#moviesModel = moviesModel;
  }

  get template() {
    return createProfileTemplate(this.#moviesModel);
  }
}
