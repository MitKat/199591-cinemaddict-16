import AbstractView from './abstract-view.js';
import {NavigationType} from '../utils/const.js';

const createMainNavigationTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional" name="${NavigationType.STATISTIC}">Stats</a>
  </nav>`
);

export default class MainNavigationView extends AbstractView {
  get template() {
    return createMainNavigationTemplate();
  }

  setNavigationClickHandler = (callback) => {
    this._callback.navigationClick = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#navigationClickHandler);
  }


  #navigationClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.navigationClick(evt.target.name);
  }
}
