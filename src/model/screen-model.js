import AbstractObservable from '../utils/abstract-observable.js';
import {NavigationType} from '../utils/const.js';

export default class ScreenModel extends AbstractObservable {
  #screen = NavigationType.FILM_LIST;

  get screen() {
    return this.#screen;
  }

  setScreen = (updateType, screen) => {
    this.#screen = screen;
    this._notify(updateType, screen);
  }
}
