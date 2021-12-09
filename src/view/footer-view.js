import {createElement} from '../render.js';

const createFooterTemplate = (length) => (
  `<section class="footer__statistics">
  <p>${length} movies inside</p>
  </section>`
);

export default class FooterView {
  #element = null;
  #length = null;

  constructor(length) {
    this.#length = length;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createFooterTemplate(this.#length);
  }

  removeElement() {
    this.#element = null;
  }
}
