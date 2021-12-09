import {createElement} from '../render.js';

const createFilmsListContainerTemplate = () => (
  `<div class="films-list__container">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  </div>`
);

export default class FilmsListContainerView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListContainerTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
