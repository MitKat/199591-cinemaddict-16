import AbstractView from './abstract-view.js';

const createFooterTemplate = (length) => (
  `<section class="footer__statistics">
  <p>${length} movies inside</p>
  </section>`
);

export default class FooterView extends AbstractView {
  #length = null;

  constructor(length) {
    super();
    this.#length = length;
  }

  get template() {
    return createFooterTemplate(this.#length);
  }
}
