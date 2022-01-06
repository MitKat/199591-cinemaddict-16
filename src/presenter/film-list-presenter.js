import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsBlockView from '../view/films-block-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import NoFilmsView from '../view/no-films-view';
import FilmPresenter from './film-presenter';
import {render, RenderPosition, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {SortType} from '../utils/const';
import dayjs from 'dayjs';

const FILM_COUNT_STEP = 5;

export default class FilmListPresenter {
    #filmListContainer = null;

    #filmsBlockComponent = new FilmsBlockView();
    #filmsListComponent = new FilmsListView();
    #buttonShowMoreComponent = new ButtonShowMoreView();
    #noFilmsComponent = new NoFilmsView();

    #movies = [];
    #sourcedMovies = [];
    #currentSortType = SortType.DEFAULT;
    #renderedFilmCount = FILM_COUNT_STEP;
    #sortingComponent = null;


    #filmPresenter = new Map();

    constructor (filmListContainer) {
      this.#filmListContainer = filmListContainer;
    }

    init = (movies) => {

      this.#movies = [...movies];
      this.#sourcedMovies = [...movies];

      this.#renderSort();
      // render(this.#filmListContainer, this.#sortComponent, RenderPosition.BEFOREEND);
      render(this.#filmListContainer, this.#filmsBlockComponent, RenderPosition.BEFOREEND);
      render(this.#filmsBlockComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);

      this.#renderFilmList(this.#movies);
    }

    #renderNoFilms = () => {
      render(this.#filmsListComponent, this.#noFilmsComponent, RenderPosition.BEFOREEND);
    }

    #sortDateFunction = (filmA, filmB) => {
      const countA = dayjs(filmA.release.date).format('YYYY');
      const countB = dayjs(filmB.release.date).format('YYYY');
      return countB - countA;
    };

    #sortRatingFunction = (filmA, filmB) => {
      const countA = filmA.filmInfo.totalRating;
      const countB = filmB.filmInfo.totalRating;
      return countB - countA;
    };

    #renderSort = () => {
      this.#sortingComponent = new SortView(this.#currentSortType);
      render(this.#filmListContainer, this.#sortingComponent, RenderPosition.AFTERBEGIN);
      this.#sortingComponent.setSortChangeHandler(this.#handleSortTypeChange);
    }

    #renderFilm = (film) => {
      const filmsContainer = this.#filmsListComponent.element.querySelector('.films-list__container');

      const filmPresenter = new FilmPresenter(filmsContainer, this.#handleFilmChange);
      filmPresenter.init(film);
      this.#filmPresenter.set(film.id, filmPresenter);
    }

    #handlerButtonShowClick = () => {
      this.#movies
        .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_STEP)
        .forEach((film) => this.#renderFilm(film));

      this.#renderedFilmCount += FILM_COUNT_STEP;

      if (this.#renderedFilmCount >= this.#movies.length) {
        remove(this.#buttonShowMoreComponent);
      }
    }

    #renderButtonShowMore = () => {
      this.#buttonShowMoreComponent.setClickHandler(this.#handlerButtonShowClick);
    }

    #sortFilms = (sortType) => {
      switch (sortType) {
        case SortType.DATE:
          this.#movies.sort(this.#sortDateFunction);
          break;
        case SortType.RATING:
          this.#movies.sort(this.#sortRatingFunction);
          break;
        default:
          this.#movies = [...this.#sourcedMovies];
      }

      this.#currentSortType = sortType;
    }

    #handleSortTypeChange = (sortType) => {
      if (this.#currentSortType === sortType) {
        return;
      }
      this.#sortFilms(sortType);

      remove(this.#sortingComponent);
      this.#clearFilmList();

      this.#renderSort();
      this.#renderFilmList();
    }

    #renderFilmList = () => {
      if (this.#movies.length === 0) {
        this.#renderNoFilms();
        return;
      }

      for (let i = 0; i < FILM_COUNT_STEP; i++) {
        this.#renderFilm(this.#movies[i]);
      }

      if (this.#movies.length > FILM_COUNT_STEP) {
        render(this.#filmsListComponent, this.#buttonShowMoreComponent, RenderPosition.BEFOREEND);

        this.#renderButtonShowMore();
      }
    }

    #clearFilmList = () => {
      this.#filmPresenter.forEach((presenter) => presenter.destroy());
      this.#filmPresenter.clear();
      this.#renderedFilmCount = FILM_COUNT_STEP;
      remove(this.#buttonShowMoreComponent);
    }

    #handleFilmChange = (updatedFilm) => {
      this.#movies = updateItem(this.#movies, updatedFilm);
      this.#sourcedMovies =updateItem(this.#sourcedMovies, updatedFilm);
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
}
