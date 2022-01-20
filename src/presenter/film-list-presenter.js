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
import {SortType, UpdateType, UserAction} from '../utils/const';
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
  #noFilmsComponent = new NoFilmsView();
  #buttonShowMoreComponent = null;
  #sortingComponent = null;
  #popupComponent = null;
  #popupCommentsComponent = null;
  #popupNewCommentComponent = null;

  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_STEP;
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
    const filterType = this.#filterModel.filter;
    const films = this.#moviesModel.movies;
    const filteredMovies = filter[filterType](films);

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

    #renderNoFilms = () => {
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
      const filmItem = this.films[filmId-1];

      this.#popupComponent = new PopupView(this.films[filmId-1]);
      this.#popupCommentsComponent = new CommentsPopupView(this.films[filmId-1]);
      this.#popupNewCommentComponent = new NewCommentView();
      console.log(this.#popupScrollPosition);
      this.#popupComponent.element.scrollTo(0, this.#popupScrollPosition);

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
            remove(this.#popupCommentsComponent);
            remove(this.#popupNewCommentComponent);

            movieCommentsNewArray.push(commentNew);

            this.#handleViewAction(
              UserAction.UPDATE_FILM,
              UpdateType.MINOR,
              {...filmItem, comments: movieCommentsNewArray}
            );
          }

          render(popupComments, new CommentsPopupView(this.films[filmId-1]), RenderPosition.BEFOREEND);
          render(popupComments, new NewCommentView(), RenderPosition.BEFOREEND);
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

    #handleWatchlistClick = (filmId) => {
      this.#savePopupPosition();
      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...this.films[filmId-1], userDetails: {
          ...this.films[filmId-1].userDetails,
          isWatchlist: !this.films[filmId-1].userDetails.isWatchlist
        }});

      this.#renderPopup(filmId);
    }

    #handleWatchedClick = (filmId) => {
      this.#savePopupPosition();
      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...this.films[filmId-1], userDetails: {
          ...this.films[filmId-1].userDetails,
          isAlreadyWatched: !this.films[filmId-1].userDetails.isAlreadyWatched
        }});
      this.#renderPopup(filmId);
    }

    #handleFavoritesClick = (filmId) => {
      this.#savePopupPosition();
      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...this.films[filmId-1], userDetails: {
          ...this.films[filmId-1].userDetails,
          isFavorite: !this.films[filmId-1].userDetails.isFavorite
        }});
      this.#renderPopup(filmId);
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
      const films = this.films.slice(0, FILM_COUNT_STEP);

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
      remove(this.#noFilmsComponent);
      remove(this.#buttonShowMoreComponent);

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
          console.log(actionType, updateType, update);

          switch (actionType) {
            case UserAction.UPDATE_FILM:
              this.#moviesModel.updateFilm(updateType, update);
              break;
            case UserAction.ADD_FILM:
              this.#moviesModel.addFilm(updateType, update);
              break;
            case UserAction.DELETE_FILM:
              this.#moviesModel.deleteFilm(updateType, update);
              break;
          }
        }

        #handleModelEvent = (updateType, data) => {
          console.log(updateType, data);

          switch (updateType) {
            case UpdateType.MINOR:
              this.#clearFilmList();
              this.#renderFilmList();
              break;
            case UpdateType.MAJOR:
              // - обновить всю доску (например, при переключении фильтра)
              this.#clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
              this.#renderFilmList();
              break;
          }
        }
}

