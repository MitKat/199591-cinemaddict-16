import {render, RenderPosition} from './render.js';
import PopupView from './view/popup-view.js';
import CommentsPopupView from './view/comments-view.js';
import NewCommentView from './view/new-comment-view.js';

const siteFooterElement = document.querySelector('.footer');

export const renderPopup = (film) => {
  render(siteFooterElement, new PopupView(film[0]).element, RenderPosition.AFTEREND);
  const popupComments = document.querySelector('.film-details__bottom-container');
  render(popupComments, new CommentsPopupView(film[0]).element, RenderPosition.BEFOREEND);
  render(popupComments, new NewCommentView().element, RenderPosition.BEFOREEND);
};

