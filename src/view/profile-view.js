import AbstractView from './abstract-view.js';

const createProfileTemplate = (filter) => {
  const {history} = filter;

  let profileName = 'Movie Buff';
  if (history === 0) {
    profileName = '';
  } else if (history <= 10) {
    profileName = 'Novice';
  } else if (history > 10 && history <= 20) {
    profileName = 'Fan';
  }

  return (`<section class="header__profile profile">
  <p class="profile__rating">${profileName}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);
};

export default class ProfileView extends AbstractView {
  #filter = null;

  constructor(filter) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createProfileTemplate(this.#filter);
  }
}
