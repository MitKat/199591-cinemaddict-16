import {createElement} from '../render.js';

const createFilmsBlockTemplate = () => (
  `<section class="films">
  </section>`
);

export default class FilmsBlockView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsBlockTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
