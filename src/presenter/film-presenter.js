import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';
import NewCommentView from '../view/new-comment-view';
import CommentsPopupView from '../view/comments-view';
import {render, RenderPosition, remove, replace} from '../utils/render.js';

const siteFooterElement = document.querySelector('.footer');
const body = document.querySelector('body');

// Идея следующая, мы должны задать структуру для нового комментария,
//как сюда забрасывать наши данные я не знаю
const commentNew = {
  id: ' ',
  author: 'Black',
  text: '',
  emotion: 'sleeping.png',
  date: ' ',
};

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


    const onCtrlEnterKeyDownHandler = (evt) => {
      if (evt.ctrlKey && evt.key === 'Enter') {
        evt.preventDefault();

        //удаляем компонент с комментариями
        remove( this.#popupCommentsComponent);

        const movieCommentsNewArray = this.#movie.comments.slice();

        movieCommentsNewArray.push(commentNew);
        this.#changeData({...this.#movie.comments,
          comments: movieCommentsNewArray
        });
        // перерисовываем новые компоненты заново, но тут init ругается
        render(popupComments, new CommentsPopupView(this.#movie), RenderPosition.BEFOREEND);
        render(popupComments, this.#popupNewCommentComponent, RenderPosition.BEFOREEND);
      }
    };

    this.#popupComponent.element.addEventListener('keydown', onCtrlEnterKeyDownHandler);


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
    this.#changeData({...this.#movie, userDetails: {
      ...this.#movie.userDetails,
      isWatchlist: !this.#movie.userDetails.isWatchlist
    }});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#movie, userDetails: {
      ...this.#movie.userDetails,
      isAlreadyWatched: !this.#movie.userDetails.isAlreadyWatched
    }});
  }

  #handleFavoritesClick = () => {
    this.#changeData({...this.#movie, userDetails: {
      ...this.#movie.userDetails,
      isFavorite: !this.#movie.userDetails.isFavorite
    }});
  }
}
