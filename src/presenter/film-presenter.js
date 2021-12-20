import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';
import NewCommentView from '../view/new-comment-view';
import CommentsPopupView from '../view/comments-view';
import {render, RenderPosition} from '../utils/render.js';

const siteFooterElement = document.querySelector('.footer');
const body = document.querySelector('body');

export default class FilmPresenter {
  #filmContainer = null;
  #movie = {};

  constructor (filmContainer) {
    this.#filmContainer = filmContainer;
  }

  init = (movie) => {
    this.#movie = movie;

    this.#renderFilm(this.#movie);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      body.classList.remove('hide-overflow');
      const popup = siteFooterElement.querySelector('.film-details');
      if (popup !== null) {
        siteFooterElement.removeChild(popup);
      }
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #renderFilm = (film) => {

    const filmCard = new FilmCardView(film);


    filmCard.setClickFilmHandler (() => {
      const popupComponent = new PopupView(film);
      body.classList.add('hide-overflow');

      const popupFilmPrevious = siteFooterElement.querySelector('.film-details');

      if (popupFilmPrevious !== null) {
        siteFooterElement.removeChild(popupFilmPrevious);
        siteFooterElement.appendChild(popupComponent.element);
      } else {
        siteFooterElement.appendChild(popupComponent.element);
        document.addEventListener('keydown', this.#onEscKeyDown);
      }

      const popupComments = popupComponent.element.querySelector('.film-details__bottom-container');
      render(popupComments, new CommentsPopupView(film), RenderPosition.BEFOREEND);
      render(popupComments, new NewCommentView(), RenderPosition.BEFOREEND);

      popupComponent.setClosePopupHandler(() => {
        siteFooterElement.removeChild(popupComponent.element);
        body.classList.remove('hide-overflow');
        document.removeEventListener('keydown', this.#onEscKeyDown);
      });
    });

    render(this.#filmContainer, filmCard, RenderPosition.BEFOREEND);
  }
}
