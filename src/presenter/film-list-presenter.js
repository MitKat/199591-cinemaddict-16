import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsBlockView from '../view/films-block-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import NoFilmsView from '../view/no-films-view';
import FilmPresenter from './film-presenter';
import {render, RenderPosition, remove} from '../utils/render.js';

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

      const filmPresenter = new FilmPresenter(filmsContainer);
      filmPresenter.init(film);
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
      this.#buttonShowMoreComponent.setClickHandler (this.#handlerButtonShowClick);
    }

    #renderFilmList = (films) => {

      if (films.length === 0) {
        this.#renderNoFilms();
        return;
      }

      for (let i = 0; i < FILM_COUNT_STEP; i++) {
        this.#renderFilm(films[i]);
      }

      if (films.length > FILM_COUNT_STEP) {
        render(this.#filmsListComponent, this.#buttonShowMoreComponent, RenderPosition.BEFOREEND);

        this.#renderButtonShowMore();
      }
    }
}
