import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../utils/const.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #comments = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async () => {
    try{
      const comments = await this.#apiService.comments;
      this.#comments = comments.map(this.#adaptCommentsToClient);

    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  }


  addComment = async (updateType, update) => {
    try {
      const response = await this.#apiService.addComment(update);
      const newComment = this.#adaptCommentsToClient(response);
      this.#comments = [newComment, ...this.#comments];
      this._notify(updateType, newComment);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  #adaptCommentsToClient = (comment) => {
    const adaptedComment = {...comment,
      text: comment['comment'],
    };

    delete adaptedComment['comment'];

    return adaptedComment;
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    try {
      await this.#apiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }

}
