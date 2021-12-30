import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';
import NewCommentView from '../view/new-comment-view';
import CommentsPopupView from '../view/comments-view';
import {render, RenderPosition, remove, replace} from '../utils/render.js';

const siteFooterElement = document.querySelector('.footer');
const body = document.querySelector('body');

export default class FilmPresenter {
  #filmContainer = null;
  #movie = {};
  #changeData = null;

  #filmComponent = null;
  #popupComponent = null;
  #popupCommentsComponent = null;
  #popupNewCommentComponent = null;

  constructor (filmContainer, changeData) {
    this.#filmContainer = filmContainer;
    this.#changeData = changeData;
  }

  init = (movie) => {
    this.#movie = movie;
    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#filmComponent = new FilmCardView(movie);

    this.#filmComponent.setClickFilmHandler(this.#renderPopupOpen);
    this.#filmComponent.setClickButtonWatchlist(this.#handleWatchlistClick);
    this.#filmComponent.setClickButtonWatched(this.#handleWatchedClick);
    this.#filmComponent.setClickButtonFavorites(this.#handleFavoritesClick);

    if (prevFilmComponent === null) {
      render(this.#filmContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (prevFilmComponent !== null) {
      replace(this.#filmComponent.element, prevFilmComponent.element);
    }

    if (prevPopupComponent !== null) {
      replace(this.#popupComponent, prevPopupComponent);
      this.#renderPopupOpen();
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  #removeElementClosePopup = () => {
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      const popup = siteFooterElement.querySelector('.film-details');
      if (popup !== null) {
        siteFooterElement.removeChild(popup);
      }
      this.#removeElementClosePopup();
    }
  };

  #renderPopupOpen = () => {
    this.#popupComponent = new PopupView(this.#movie);
    this.#popupCommentsComponent = new CommentsPopupView(this.#movie);
    this.#popupNewCommentComponent = new NewCommentView();

    body.classList.add('hide-overflow');

    const popupFilmPrevious = siteFooterElement.querySelector('.film-details');

    if (popupFilmPrevious !== null) {
      siteFooterElement.removeChild(popupFilmPrevious);
      siteFooterElement.appendChild(this.#popupComponent.element);
    } else {
      siteFooterElement.appendChild(this.#popupComponent.element);
      document.addEventListener('keydown', this.#onEscKeyDown);
    }

    const popupComments = this.#popupComponent.element.querySelector('.film-details__bottom-container');
    render(popupComments, this.#popupCommentsComponent, RenderPosition.BEFOREEND);
    render(popupComments, this.#popupNewCommentComponent, RenderPosition.BEFOREEND);

    this.#popupComponent.setClosePopupHandler(() => {
      siteFooterElement.removeChild(this.#popupComponent.element);
      this.#removeElementClosePopup();
    });

    this.#popupComponent.setClickButtonPopupWatchlist(this.#handleWatchlistClick);
    this.#popupComponent.setClickButtonPopupWatched(this.#handleWatchedClick);
    this.#popupComponent.setClickButtonPopupFavorites(this.#handleFavoritesClick);
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#popupComponent);
  }

  #handleWatchlistClick = () => {
    this.#changeData({...this.#movie, isWatchlist: !this.#movie.isWatchlist});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#movie, isAlreadyWatched: !this.#movie.isAlreadyWatched});
  }

  #handleFavoritesClick = () => {
    this.#changeData({...this.#movie, isFavorite: !this.#movie.isFavorite});
  }
}