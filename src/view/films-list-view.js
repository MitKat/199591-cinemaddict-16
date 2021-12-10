import {createElement} from '../render.js';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <div class="films-list__container">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </div>
  </section>`
);

export default class FilmsListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
