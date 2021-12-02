import {renderTemplate, RenderPosition} from './render.js';
import {createMainNavigationTemplate} from './view/main-navigation-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createProfileTemplate} from './view/profile-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createFilmsListTemplate} from './view/films-list-view.js';
import {createFilmsBlockTemplate} from './view/films-block-view.js';
import {createButtonShowMoreTemplate} from './view/button-show-more-view.js';
// import {createPopupTemplate} from './view/popup-view.js';
import {createStatisticTemplate} from './view/statistic-view.js';
import {createFooterTemplate} from './view/footer-view.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateFilter} from './mock/filter-films.js';

const FILM_COUNT = 28;
const FILM_COUNT_STEP = 5;
const cardsFilm = Array.from({length: FILM_COUNT}, generateCardFilm);

const filters = generateFilter(cardsFilm);

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createProfileTemplate(filters), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

renderTemplate(siteMainElement, createMainNavigationTemplate(filters), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement, createFilmsBlockTemplate(), RenderPosition.BEFOREEND);

const filmsBlock = siteMainElement.querySelector('.films');

renderTemplate(filmsBlock, createFilmsListTemplate(), RenderPosition.BEFOREEND);

const filmsList = siteMainElement.querySelector('.films-list__container');

for (let i=0; i< FILM_COUNT_STEP; i++) {
  renderTemplate(filmsList, createFilmCardTemplate(cardsFilm[i]), RenderPosition.BEFOREEND);
}
if (cardsFilm.length > FILM_COUNT_STEP) {
  let renderedFilmCount = FILM_COUNT_STEP;
  renderTemplate(filmsBlock, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

  const ButtonShowMore = filmsBlock.querySelector('.films-list__show-more');

  ButtonShowMore.addEventListener('click', (evt) => {
    evt.preventDefault();
    cardsFilm
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_STEP)
      .forEach((film) => renderTemplate(filmsList, createFilmCardTemplate(film), RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_STEP;

    if (renderedFilmCount >= cardsFilm.length) {
      ButtonShowMore.remove();
    }
  });
}

renderTemplate(siteMainElement, createStatisticTemplate(), RenderPosition.BEFOREEND);

// renderTemplate(siteFooterElement, createPopupTemplate(cardsFilm[0]), RenderPosition.AFTEREND);
renderTemplate(siteFooterElement, createFooterTemplate(cardsFilm.length), RenderPosition.BEFOREEND);
