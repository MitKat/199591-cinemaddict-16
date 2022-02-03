import {createElement} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 800;
const MILLISECONDS_IN_SECOND = 1000;

export default class AbstractView {
  #element = null;
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }

  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_IN_SECOND}s`;
    setTimeout(() => {
      this.element.style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
