import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsBlockView from '../view/films-block-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import PopupView from '../view/popup-view';
import NewCommentView from '../view/new-comment-view';
import CommentsPopupView from '../view/comments-view';
import NoFilmsView from '../view/no-films-view';
import FilmPresenter from './film-presenter.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {FilterType, SortType, UpdateType, UserAction} from '../utils/const';
import {sortDateFunction, sortRatingFunction} from '../utils/common';
import {filter} from '../utils/filter.js';
import {nanoid} from 'nanoid';

const FILM_COUNT_STEP = 5;
const siteFooterElement = document.querySelector('.footer');
const body = document.querySelector('body');

export default class FilmListPresenter {
  #filmListContainer = null;
  #filmsBlockComponent = new FilmsBlockView();
  #filmsListComponent = new FilmsListView();
  #noFilmsComponent = null;
  #buttonShowMoreComponent = null;
  #sortingComponent = null;
  #popupComponent = null;
  #popupCommentsComponent = null;
  #popupNewCommentComponent = null;

  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_STEP;
  #filterType = FilterType.ALL;
  #popupScrollPosition = 0;

  #moviesModel = null;
  #filterModel = null;

  #filmPresenter = new Map();

  constructor (filmListContainer, moviesModel, filterModel) {
    this.#filmListContainer = filmListContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#moviesModel.movies;
    const filteredMovies = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortDateFunction);
      case SortType.RATING:
        return filteredMovies.sort(sortRatingFunction);
    }
    return filteredMovies;
  }

    init = () => {
      this.#renderSort();
      render(this.#filmListContainer, this.#filmsBlockComponent, RenderPosition.BEFOREEND);
      render(this.#filmsBlockComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);
      this.#renderFilmList(this.films);
    }

    destroy = () => {
      this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
    }

    #findFilmById = (filmId) => this.#moviesModel.movies.find((film) => film.id === filmId)

    #renderNoFilms = () => {
      this.#noFilmsComponent = new NoFilmsView(this.#filterType);
      remove(this.#sortingComponent);
      render(this.#filmsListComponent, this.#noFilmsComponent, RenderPosition.BEFOREEND);
    }

    #renderSort = () => {
      this.#sortingComponent = new SortView(this.#currentSortType);
      render(this.#filmListContainer, this.#sortingComponent, RenderPosition.AFTERBEGIN);
      this.#sortingComponent.setSortChangeHandler(this.#handleSortTypeChange);
    }

    #renderFilm = (film) => {
      const filmsContainer = this.#filmsListComponent.element.querySelector('.films-list__container');
      const filmPresenter = new FilmPresenter(filmsContainer, this.#handleViewAction, this.#popupOpen);
      filmPresenter.init(film);
      this.#filmPresenter.set(film.id, filmPresenter);
    }

    #savePopupPosition = () => {
      this.#popupScrollPosition = this.#popupComponent.element.scrollTop;
    }

    #removeElementClosePopup = () => {
      body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#popupScrollPosition = 0;
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

    #popupOpen = (filmId) => {
      this.#renderPopup(filmId);
    }

    #renderPopup = (filmId) => {
      const filmItem = this.#findFilmById(filmId);

      this.#popupComponent = new PopupView(filmItem);
      this.#popupCommentsComponent = new CommentsPopupView(filmItem);
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

      this.#popupCommentsComponent.setDeleteClickHandler(this.#handleDeleteClickComment);

      const onCtrlEnterKeyDownHandler = (evt) => {
        const commentNew = {
          id: nanoid(),
          text: '',
          emotion: '',
        };

        if (evt.ctrlKey && evt.key === 'Enter') {
          evt.preventDefault();
          this.#savePopupPosition();

          const movieCommentsNewArray = filmItem.comments.slice();
          commentNew.text = this.#popupNewCommentComponent._data.message;
          commentNew.emotion =  `${this.#popupNewCommentComponent._data.smile}.png`;

          if (commentNew.text !== '' && commentNew.emotion !== '') {
            movieCommentsNewArray.push(commentNew);

            this.#updateCommentsArray(filmItem, movieCommentsNewArray);
          }
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

      this.#popupComponent.element.scroll(0, this.#popupScrollPosition);
    }

    #updateCommentsArray = (filmItem, movieCommentsNewArray) => {
      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...filmItem, comments: movieCommentsNewArray}
      );
    }

    #handleDeleteClickComment = (filmId, commentId) => {
      this.#savePopupPosition();
      remove(this.#popupCommentsComponent);
      const filmItem = this.#findFilmById(filmId);
      const {comments} = filmItem;
      const oldCommentIndex = comments.findIndex((comment) => comment.id === commentId);

      const movieCommentsNewArray = [
        ...comments.slice(0, oldCommentIndex),
        ...comments.slice(oldCommentIndex + 1),
      ];
      this.#updateCommentsArray(filmItem, movieCommentsNewArray);
    }

    #handleWatchlistClick = (filmId) => {
      const filmItem = this.#findFilmById(filmId);
      this.#savePopupPosition();

      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...filmItem, userDetails: {
          ...filmItem.userDetails,
          isWatchlist: !filmItem.userDetails.isWatchlist
        }});
    }

    #handleWatchedClick = (filmId) => {
      const filmItem = this.#findFilmById(filmId);
      this.#savePopupPosition();

      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...filmItem, userDetails: {
          ...filmItem.userDetails,
          isAlreadyWatched: !filmItem.userDetails.isAlreadyWatched
        }});
    }

    #handleFavoritesClick = (filmId) => {
      const filmItem = this.#findFilmById(filmId);
      this.#savePopupPosition();

      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...filmItem, userDetails: {
          ...filmItem.userDetails,
          isFavorite: !filmItem.userDetails.isFavorite
        }});
    }

    #handlerButtonShowClick = () => {
      const filmCount = this.films.length;
      const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_STEP);
      const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

      films.forEach((film) => this.#renderFilm(film));

      this.#renderedFilmCount = newRenderedFilmCount;
      if (this.#renderedFilmCount >= filmCount) {
        remove(this.#buttonShowMoreComponent);
      }
    }

    #renderButtonShowMore = () => {
      this.#buttonShowMoreComponent = new ButtonShowMoreView();
      this.#buttonShowMoreComponent.setClickHandler(this.#handlerButtonShowClick);
      render(this.#filmsListComponent, this.#buttonShowMoreComponent, RenderPosition.BEFOREEND);
    }

    #handleSortTypeChange = (sortType) => {
      if (this.#currentSortType === sortType) {
        return;
      }
      this.#currentSortType = sortType;
      remove(this.#sortingComponent);
      this.#clearFilmList();
      this.#renderSort();
      this.#renderFilmList();
    }

    #renderFilmList = () => {
      const filmCount = this.films.length;

      const films = this.films.slice(0, Math.min(filmCount, this.#renderedFilmCount));

      if (filmCount === 0) {
        this.#renderNoFilms();
        return;
      }

      films.forEach((film) => this.#renderFilm(film));

      if (filmCount > FILM_COUNT_STEP) {
        this.#renderButtonShowMore();
      }
    }

    #clearFilmList = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
      const filmCount = this.films.length;

      this.#filmPresenter.forEach((presenter) => presenter.destroy());
      this.#filmPresenter.clear();
      remove(this.#sortingComponent);
      remove(this.#buttonShowMoreComponent);

      if (this.#noFilmsComponent) {
        remove(this.#noFilmsComponent);
      }

      if (resetRenderedFilmCount) {
        this.#renderedFilmCount = FILM_COUNT_STEP;
      } else {
        this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
      }

      if (resetSortType) {
        this.#currentSortType = SortType.DEFAULT;
      }
    }

        #handleViewAction = (actionType, updateType, update) => {
          // console.log(actionType, updateType, update);

          switch (actionType) {
            case UserAction.UPDATE_FILM:
              this.#moviesModel.updateFilm(updateType, update);
              break;
            case UserAction.DELETE_COMMENT:
              this.#moviesModel.deleteComment(updateType, update);
              break;
          }
        }

        #handleModelEvent = (updateType, data) => {
          // console.log(updateType, data);

          switch (updateType) {
            case UpdateType.PATCH:
              this.#clearFilmList();
              this.#renderSort();
              this.#renderFilmList();
              break;
            case UpdateType.MINOR:
              this.#clearFilmList();
              this.#renderSort();
              this.#renderFilmList();
              this.#renderPopup(data.id);
              break;
            case UpdateType.MAJOR:
              // - обновить всю доску (например, при переключении фильтра)
              this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
              this.#renderSort();
              this.#renderFilmList();
              break;
          }
        }
}

