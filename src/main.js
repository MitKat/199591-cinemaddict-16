import {render, RenderPosition, remove} from './utils/render.js';
// import {createStatisticTemplate} from './view/statistic-view.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateFilter} from './mock/filter-films.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';
import SortView from './view/sort-view.js';
import FilmsBlockView from './view/films-block-view.js';
import FilmsListView from './view/films-list-view.js';
import FilmCardView from './view/film-card-view.js';
import ButtonShowMoreView from './view/button-show-more-view.js';
import PopupView from './view/popup-view.js';
import CommentsPopupView from './view/comments-view.js';
import NewCommentView from './view/new-comment-view.js';
import FooterView from './view/footer-view.js';
import NoFilmsView from './view/no-films-view.js';

const FILM_COUNT = 33;
const FILM_COUNT_STEP = 5;

const filmCards = Array.from({length: FILM_COUNT}, (_, i) => generateCardFilm(i+1));
const filters = generateFilter(filmCards);

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

const renderFilm = (container, film) => {
  const filmCard = new FilmCardView(film);

  const body = document.querySelector('body');

  filmCard.setClickFilmHandler (() => {
    const popupComponent = new PopupView(film);
    const popupFilm = siteFooterElement.querySelector('.film-details');

    body.classList.add('hide-overflow');

    if (popupFilm !== null) {
      siteFooterElement.removeChild(popupFilm);
      siteFooterElement.appendChild(popupComponent.element);
    } else {
      siteFooterElement.appendChild(popupComponent.element);
    }

    const popupComments = popupComponent.element.querySelector('.film-details__bottom-container');
    render(popupComments, new CommentsPopupView(film), RenderPosition.BEFOREEND);
    render(popupComments, new NewCommentView(), RenderPosition.BEFOREEND);

    popupComponent.setClickPopupFilmHandler(() => {
      siteFooterElement.removeChild(popupComponent.element);
      body.classList.remove('hide-overflow');
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        body.classList.remove('hide-overflow');
        siteFooterElement.removeChild(popupComponent.element);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);
  });

  render(container, filmCard, RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new ProfileView(filters), RenderPosition.BEFOREEND);
render(siteMainElement, new MainNavigationView(filters), RenderPosition.AFTERBEGIN);
render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);


const renderFilmsList = (container, films) => {
  const filmsBlockComponent = new FilmsBlockView();
  const filmsListComponent = new FilmsListView();
  const buttonShowMoreComponent = new ButtonShowMoreView();

  render(container, filmsBlockComponent, RenderPosition.BEFOREEND);
  render(filmsBlockComponent, filmsListComponent, RenderPosition.BEFOREEND);

  const filmsContainer = filmsListComponent.element.querySelector('.films-list__container');

  if (films.length === 0) {
    render(filmsListComponent, new NoFilmsView(), RenderPosition.BEFOREEND);
    return;
  }

  for (let i = 0; i < FILM_COUNT_STEP; i++) {
    renderFilm(filmsContainer, films[i]);
  }

  if (films.length > FILM_COUNT_STEP) {
    let renderedFilmCount = FILM_COUNT_STEP;
    render(filmsListComponent, buttonShowMoreComponent, RenderPosition.BEFOREEND);

    buttonShowMoreComponent.setClickHandler (() => {
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_STEP)
        .forEach((film) => renderFilm(filmsContainer, film));

      renderedFilmCount += FILM_COUNT_STEP;

      if (renderedFilmCount >= filmCards.length) {
        remove(buttonShowMoreComponent);
      }
    });
  }

};

renderFilmsList(siteMainElement, filmCards);

render(siteFooterElement, new FooterView(filmCards.length), RenderPosition.BEFOREEND);

// renderTemplate(siteMainElement, createStatisticTemplate(), RenderPosition.BEFOREEND);


