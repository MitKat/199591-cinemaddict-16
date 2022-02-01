import SmartView from './smart-view.js';
import he from 'he';

const createNewCommentTemplate = (_data) => {
  const {emotion, text, isDisabled} = _data;
  const emojiImage = emotion !== ''
    ? `<img src="./images/emoji/${emotion}.png"  width="55" height="55" alt="${emotion}">`
    : '';

  const comment = text !== ''
    ? `${text}`
    : '';

  return `<div class="film-details__new-comment">
     <div class="film-details__add-emoji-label">
     ${emojiImage}
     </div>

     <label class="film-details__comment-label">
       <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" ${isDisabled ? 'disabled' : ''} name="comment">${he.encode(comment)}</textarea>
     </label>

     <div class="film-details__emoji-list">
       <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isDisabled ? 'disabled' : ''}>
       <label class="film-details__emoji-label" for="emoji-smile">
         <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" ${isDisabled ? 'disabled' : ''} name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
       <label class="film-details__emoji-label" for="emoji-sleeping">
         <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" ${isDisabled ? 'disabled' : ''} name="comment-emoji" type="radio" id="emoji-puke" value="puke">
       <label class="film-details__emoji-label" for="emoji-puke">
         <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
       </label>

       <input class="film-details__emoji-item visually-hidden" ${isDisabled ? 'disabled' : ''} name="comment-emoji" type="radio" id="emoji-angry" value="angry">
       <label class="film-details__emoji-label" for="emoji-angry">
         <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
       </label>
     </div>
    </div>`;
};

export default class NewCommentView extends SmartView {

  constructor() {
    super();

    this._data = {
      emotion: '',
      text: '',
      isDisabled: false,
    };

    this.#setInnerHandlers();
  }

  get template() {
    return createNewCommentTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#descriptionInputHandler);

    this.element.querySelectorAll('.film-details__emoji-item')
      .forEach((emotion) => emotion.addEventListener('click', this.#clickEmojiHandler));
  }

  #clickEmojiHandler = (evt) => {
    evt.preventDefault();

    this.updateData({
      emotion: evt.target.value,
    });
  }

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      text: evt.target.value,
    }, true);
  }

}

