import SortView from '../view/sort-view';
import FilmsListView from '../view/films-list-view';
import FilmsBlockView from '../view/films-block-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import NoFilmsView from '../view/no-films-view';
import {render, RenderPosition, remove} from '../utils/render.js';
import FilmCardView from '../view/film-card-view';
import PopupView from '../view/popup-view';
import NewCommentView from '../view/new-comment-view';
import CommentsPopupView from '../view/comments-view';

const FILM_COUNT_STEP = 5;
const siteFooterElement = document.querySelector('.footer');
const body = document.querySelector('body');

export default class FilmPresenter {
    #filmContainer = null;

    #sortComponent = new SortView();
    #filmsBlockComponent = new FilmsBlockView();
    #filmsListComponent = new FilmsListView();
    #buttonShowMoreComponent = new ButtonShowMoreView();
    #noFilmsComponent = new NoFilmsView();

    #movies = [];

    constructor (filmContainer) {
      this.#filmContainer = filmContainer;
    }

    init = (movies) => {
      this.#movies = [...movies];


      render(this.#filmContainer, this.#sortComponent, RenderPosition.BEFOREEND);

      render(this.#filmContainer, this.#filmsBlockComponent, RenderPosition.BEFOREEND);
      render(this.#filmsBlockComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);

      this.#renderFilmList(this.#movies);
    }

    #renderNoFilms = () => {
      render(this.#filmsListComponent, this.#noFilmsComponent, RenderPosition.BEFOREEND);
    }

    #renderFilm = (container, film) => {
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

      render(container, filmCard, RenderPosition.BEFOREEND);
    }

    #onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        body.classList.remove('hide-overflow');
        const popupFilm2 = siteFooterElement.querySelector('.film-details');
        if (popupFilm2 !== null) {
          siteFooterElement.removeChild(popupFilm2);
        }
        document.removeEventListener('keydown', this.#onEscKeyDown());
      }
    };

    #renderFilmList = (films) => {
      const filmsContainer = this.#filmsListComponent.element.querySelector('.films-list__container');

      if (films.length === 0) {
        this.#renderNoFilms();
        return;
      }

      for (let i = 0; i < FILM_COUNT_STEP; i++) {
        this.#renderFilm(filmsContainer, films[i]);
      }

      if (films.length > FILM_COUNT_STEP) {
        let renderedFilmCount = FILM_COUNT_STEP;
        render(this.#filmsListComponent, this.#buttonShowMoreComponent, RenderPosition.BEFOREEND);

        this.#buttonShowMoreComponent.setClickHandler (() => {
          films
            .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_STEP)
            .forEach((film) => this.#renderFilm(filmsContainer, film));

          renderedFilmCount += FILM_COUNT_STEP;

          if (renderedFilmCount >= this.#movies.length) {
            remove(this.#buttonShowMoreComponent);
          }
        });
      }
    }
}
