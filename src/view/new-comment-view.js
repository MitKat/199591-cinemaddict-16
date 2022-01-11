import AbstractView from './abstract-view.js';

const createNewCommentTemplate = (emotion) => {
  const emojiImage = emotion !== ''
    ? `<img src="./images/emoji/${emotion}" width="55" height="55" alt="${emotion}">`
    : '';

  return `<div class="film-details__new-comment">
     <div class="film-details__add-emoji-label">
     ${emojiImage}
     </div>

     <label class="film-details__comment-label">
       <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
     </label>

     <div class="film-details__emoji-list">
       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
       <label class="film-details__emoji-label" for="emoji-smile">
         <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
       <label class="film-details__emoji-label" for="emoji-sleeping">
         <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
       <label class="film-details__emoji-label" for="emoji-puke">
         <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
       <label class="film-details__emoji-label" for="emoji-angry">
         <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
       </label>
     </div>
    </div>`;
};

export default class NewCommentView extends AbstractView {
  #emotion = null;

  constructor(emotion) {
    super();
    this.#emotion = emotion;
  }

  get template() {
    return createNewCommentTemplate(this.#emotion);
  }

  setClickEmojiItem = (callback) => {
    this._callback.clickEmojiItem = callback;
    this.element.querySelectorAll('.film-details__emoji-item').forEach((emotion) => emotion.addEventListener('click', this.#clickEmojiHandler));
  }

  #clickEmojiHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickEmojiItem();
  }

}


