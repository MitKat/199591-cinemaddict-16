import AbstractView from './abstract-view.js';

const createCommentItemTemplate = (comment) => {
  const {author, text, date, emotion} = comment;

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}" width="55" height="55" alt="${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${date}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

const createCommentsPopupTemplate = (film) => {
  const {comments} = film;
  const commentItemTemplate = comments.map((comment) => createCommentItemTemplate(comment))
    .join(' ');

  return `<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

  <ul class="film-details__comments-list">
   ${commentItemTemplate}
  </ul>
</section>`;
};

export default class CommentsPopupView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createCommentsPopupTemplate(this.#film);
  }
}
