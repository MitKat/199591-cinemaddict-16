import SmartView from './smart-view.js';
import he from 'he';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const createCommentItemTemplate = (comment, data) => {
  const {id, author, text, date, emotion} = comment;
  const {isDeleting, deletingCommentId} = data;
  const isDisabled = isDeleting && deletingCommentId === id;

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(text)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
      <button class="film-details__comment-delete"  ${isDisabled ? 'disabled' : ''} value="${id}">${isDisabled ? 'deleting...' : 'delete'}</button>
    </p>
  </div>
</li>`;
};

const createCommentsPopupTemplate = (comments, isDeleting, deletingCommentId) => {
  const commentItemTemplate = comments.map((comment) => createCommentItemTemplate(comment, isDeleting, deletingCommentId))
    .join(' ');

  return `<section class="film-details__comments-wrap">
  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

  <ul class="film-details__comments-list">
   ${commentItemTemplate}
  </ul>
</section>`;
};

export default class CommentsPopupView extends SmartView {
  #comments = null;
  #film = null;

  constructor(film, comments) {
    super();
    this.#comments = comments;
    this.#film = film;
    this._data = {
      isDeleting: false,
      deletingCommentId: null,
    };
  }

  get template() {
    return createCommentsPopupTemplate(this.#comments, this._data);
  }

  restoreHandlers = () => {
    this.#deleteClickHandler();
  };


  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.#deleteClickHandler();
  }

  #deleteClickHandler = () => {
    this.element.querySelectorAll('.film-details__comment-delete')
      .forEach((comment) => comment.addEventListener('click', (evt) => this.#commentDeleteClickHandler(evt, this.#film)));
  }

  #commentDeleteClickHandler = (evt, film) => {
    evt.preventDefault();
    this._callback.deleteClick(film, evt.target.value);
  }


}
