import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsBlockView from '../view/films-block-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import NoFilmsView from '../view/no-films-view';
import FilmPresenter from './film-presenter';
import {render, RenderPosition, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';

const FILM_COUNT_STEP = 5;

export default class FilmListPresenter {
    #filmListContainer = null;

    #sortComponent = new SortView();
    #filmsBlockComponent = new FilmsBlockView();
    #filmsListComponent = new FilmsListView();
    #buttonShowMoreComponent = new ButtonShowMoreView();
    #noFilmsComponent = new NoFilmsView();

    #movies = [];
    #renderedFilmCount = FILM_COUNT_STEP;

    #filmPresenter = new Map();

    constructor (filmListContainer) {
      this.#filmListContainer = filmListContainer;
    }

    init = (movies) => {
      this.#movies = [...movies];

      render(this.#filmListContainer, this.#sortComponent, RenderPosition.BEFOREEND);
      render(this.#filmListContainer, this.#filmsBlockComponent, RenderPosition.BEFOREEND);
      render(this.#filmsBlockComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);

      this.#renderFilmList(this.#movies);
    }

    #renderNoFilms = () => {
      render(this.#filmsListComponent, this.#noFilmsComponent, RenderPosition.BEFOREEND);
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
      this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    }
}
