import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsBlockView from '../view/films-block-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import NoFilmsView from '../view/no-films-view';
import FilmPresenter from './film-presenter';
import {render, RenderPosition, remove} from '../utils/render.js';
import {SortType, UpdateType, UserAction} from '../utils/const';
import {sortDateFunction, sortRatingFunction} from '../utils/common';

const FILM_COUNT_STEP = 5;

export default class FilmListPresenter {
    #filmListContainer = null;

    #filmsBlockComponent = new FilmsBlockView();
    #filmsListComponent = new FilmsListView();
    #noFilmsComponent = new NoFilmsView();
    #buttonShowMoreComponent = null;

    #currentSortType = SortType.DEFAULT;
    #renderedFilmCount = FILM_COUNT_STEP;
    #sortingComponent = null;
    #moviesModel = null;


    #filmPresenter = new Map();

    constructor (filmListContainer, moviesModel) {
      this.#filmListContainer = filmListContainer;
      this.#moviesModel = moviesModel;

      this.#moviesModel.addObserver(this.#handleModelEvent);
    }

    get films() {
      switch (this.#currentSortType) {
        case SortType.DATE:
          return [...this.#moviesModel.movies].sort(sortDateFunction);
        case SortType.RATING:
          return [...this.#moviesModel.movies].sort(sortRatingFunction);
      }

      return this.#moviesModel.movies;
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

      const filmPresenter = new FilmPresenter(filmsContainer, this.#handleViewAction);
      filmPresenter.init(film);
      this.#filmPresenter.set(film.id, filmPresenter);
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

      for (let i = 0; i < FILM_COUNT_STEP; i++) {
        this.#renderFilm(films[i]);
      }

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
        case UpdateType.PATCH:
          // - обновить часть списка (например, когда поменялось описание)
          this.#filmPresenter.get(data.id).init(data);
          break;
        case UpdateType.MINOR:
          // - обновить список (например, когда задача ушла в архив)
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
