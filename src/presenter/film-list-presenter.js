import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsBlockView from '../view/films-block-view';
import FilmsListExtraView from '../view/films-list-extra-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import PopupView from '../view/popup-view';
import NewCommentView from '../view/new-comment-view';
import CommentsPopupView from '../view/comments-view';
import NoFilmsView from '../view/no-films-view';
import LoadingView from '../view/loading-view';
import FilmPresenter from './film-presenter.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {FilterType, SortType, UpdateType, UserAction} from '../utils/const';
import {sortDateFunction, sortRatingFunction, sortCommentLengthFunction} from '../utils/common';
import {filter} from '../utils/filter.js';

const FILM_COUNT_STEP = 5;
const FILM_COUNT_EXTRA = 2;
const TitleExtra = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};
const siteFooterElement = document.querySelector('.footer');
const body = document.querySelector('body');

export default class FilmListPresenter {
  #filmListContainer = null;
  #filmsBlockComponent = new FilmsBlockView();
  #filmsListComponent = new FilmsListView();
  #filmsTopRatedComponent = new FilmsListExtraView(TitleExtra.TOP_RATED);
  #filmsMostCommentedComponent = new FilmsListExtraView(TitleExtra.MOST_COMMENTED);
  #loadingComponent = new LoadingView();
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
  #isLoading = true;
  #comments = [];

  #moviesModel = null;
  #filterModel = null;
  #apiService = null;

  #filmPresenter = new Map();

  constructor (filmListContainer, moviesModel, filterModel, apiService) {
    this.#filmListContainer = filmListContainer;
    this.#moviesModel = moviesModel;
    this.#filterModel = filterModel;
    this.#apiService = apiService;
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#moviesModel.movies.slice();
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
    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  destroy = () => {
    this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
    this.#moviesModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
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

  #renderPopup = async (filmId) => {
    const filmItem = this.#findFilmById(filmId);
    this.#comments = await this.#apiService.getComments(filmId);
    this.#comments = this.#comments.map(this.#adaptCommentsToClient);
    this.#popupComponent = new PopupView(filmItem);
    this.#popupCommentsComponent = new CommentsPopupView(filmItem, this.#comments);
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

    const onCtrlEnterKeyDownHandler = async (evt) => {
      const commentNew = {
        text: '',
        emotion: '',
      };

      if (evt.ctrlKey && evt.key === 'Enter') {
        evt.preventDefault();
        this.#savePopupPosition();

        commentNew.text = this.#popupNewCommentComponent.commentText;
        commentNew.emotion =  this.#popupNewCommentComponent.emoji;

        if (commentNew.text !== '' && commentNew.emotion !== '') {
          try {
            this.#popupNewCommentComponent.updateData({isDisabled: true});
            const movieNew = await this.#apiService.addComment(filmItem, commentNew);
            this.#moviesModel.updateFilmModel(UpdateType.MINOR, movieNew.movie);
          } catch(err) {
            const unlockForm = () => this.#popupNewCommentComponent.updateData({isDisabled: false});
            this.#popupComponent.shake(unlockForm);
          }
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

  #adaptCommentsToClient = (comment) => {
    const adaptedComment = {...comment,
      text: comment['comment'],
    };

    delete adaptedComment['comment'];

    return adaptedComment;
  }

  #handleDeleteClickComment = async (filmItem, commentId) => {
    try {
      this.#savePopupPosition();
      this.#popupCommentsComponent.updateData({isDeleting: true, deletingCommentId: commentId});
      await this.#apiService.deleteComment(commentId);
      this.#moviesModel.updateFilm(UpdateType.MINOR, filmItem);
    } catch(err) {
      const resetDelete = () => this.#popupCommentsComponent.updateData({isDeleting: false, deletingCommentId: null});
      this.#popupComponent.shake(resetDelete);
    }
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
    this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: false});
    this.#renderSort();
    this.#renderFilmList();
  }

  #renderLoading = () => {
    render(this.#filmsBlockComponent, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmList = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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

    this.#renderFilmsListExtra(films);
  }

  #clearFilmList = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmCount = this.films.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    remove(this.#loadingComponent);
    remove(this.#sortingComponent);
    remove(this.#filmsTopRatedComponent);
    remove(this.#filmsMostCommentedComponent);
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

  #renderFilmExtra = (filmsContainer, filmsCopy) => {
    for (let i = 0; i < FILM_COUNT_EXTRA; i++) {
      const filmPresenter = new FilmPresenter(filmsContainer, this.#handleViewAction, this.#popupOpen);
      filmPresenter.init(filmsCopy[i]);
    }
  }

  #renderFilmsListExtra = () => {
    const isfilmRating = this.films.some((film) => film.filmInfo.totalRating);

    if (isfilmRating) {
      const filmsCopy = this.films.slice();
      filmsCopy.sort(sortRatingFunction);
      render(this.#filmsBlockComponent, this.#filmsTopRatedComponent, RenderPosition.BEFOREEND);
      const filmsContainer = this.#filmsTopRatedComponent.element.querySelector('.films-list__container');
      this.#renderFilmExtra(filmsContainer, filmsCopy);
    }

    const isfilmComment = this.films.some((film) => film.comments);
    if (isfilmComment) {
      const filmsCopy = this.films.slice();
      filmsCopy.sort(sortCommentLengthFunction);
      render(this.#filmsBlockComponent, this.#filmsMostCommentedComponent, RenderPosition.BEFOREEND);
      const filmsContainer = this.#filmsMostCommentedComponent.element.querySelector('.films-list__container');
      this.#renderFilmExtra(filmsContainer, filmsCopy);
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#moviesModel.updateFilm(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
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
        this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderSort();
        this.#renderFilmList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmList();
        break;
    }
  }
}

