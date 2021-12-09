import {render, RenderPosition} from './render.js';
// import {createStatisticTemplate} from './view/statistic-view.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateFilter} from './mock/filter-films.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';
import SortView from './view/sort-view.js';
import FilmsBlockView from './view/films-block-view.js';
import FilmsListView from './view/films-list-view.js';
import FilmsListContainerView from './view/films-list-container-view.js';
import FilmCardView from './view/film-card-view.js';
import ButtonShowMoreView from './view/button-show-more-view.js';
import FooterView from './view/footer-view.js';

const FILM_COUNT = 28;
const FILM_COUNT_STEP = 5;

const filmCards = Array.from({length: FILM_COUNT}, (_, i) => generateCardFilm(i+1));

const filters = generateFilter(filmCards);
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

render(siteHeaderElement, new ProfileView(filters).element, RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');
render(siteMainElement, new MainNavigationView(filters).element, RenderPosition.AFTERBEGIN);
render(siteMainElement, new SortView().element, RenderPosition.BEFOREEND);

const filmsBlockComponent = new FilmsBlockView();
const filmsListComponent = new FilmsListView();
const filmsListContainerComponent = new FilmsListContainerView();
const buttonShowMoreComponent = new ButtonShowMoreView();

render(siteMainElement, filmsBlockComponent.element, RenderPosition.BEFOREEND);
render(filmsBlockComponent.element, filmsListComponent.element, RenderPosition.BEFOREEND);
render(filmsListComponent.element, filmsListContainerComponent.element, RenderPosition.BEFOREEND);

for (let i=0; i< FILM_COUNT_STEP; i++) {
  render(filmsListContainerComponent.element, new FilmCardView(filmCards[i]).element, RenderPosition.BEFOREEND);
}

if (filmCards.length > FILM_COUNT_STEP) {
  let renderedFilmCount = FILM_COUNT_STEP;
  render(filmsListComponent.element, buttonShowMoreComponent.element, RenderPosition.BEFOREEND);

  buttonShowMoreComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_STEP)
      .forEach((film) => render(filmsListContainerComponent.element, new FilmCardView(film).element, RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_STEP;

    if (renderedFilmCount >= filmCards.length) {
      buttonShowMoreComponent.element.remove();
      buttonShowMoreComponent.removeElement();
    }
  });
}
render(siteFooterElement, new FooterView(filmCards.length).element, RenderPosition.BEFOREEND);

// renderPopup(filmCards);
// renderTemplate(siteMainElement, createStatisticTemplate(), RenderPosition.BEFOREEND);


