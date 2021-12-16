import AbstractView from './abstract-view.js';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <div class="films-list__container">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </div>
  </section>`
);

export default class FilmsListView extends AbstractView {
  get template() {
    return createFilmsListTemplate();
  }
}
