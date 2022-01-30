import AbstractView from './abstract-view.js';
import he from 'he';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const createCommentItemTemplate = (comment) => {
  const {id, author, text, date, emotion} = comment;

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(text)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
      <button class="film-details__comment-delete" value="${id}">Delete</button>
    </p>
  </div>
</li>`;
};

const createCommentsPopupTemplate = (comments) => {
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
  #comments = null;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createCommentsPopupTemplate(this.#comments);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((comment) => comment.addEventListener('click', this.#commentDeleteClickHandler));
  }

  #commentDeleteClickHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.value;
    this._callback.deleteClick(commentId);
  }
}
