import {renderTemplate, RenderPosition} from './render.js';
import {createMainNavigationTemplate} from './view/main-navigation-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createProfileTemplate} from './view/profile-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createFilmsListTemplate} from './view/films-list-view.js';
import {createFilmsBlockTemplate} from './view/films-block-view.js';
// import {createPopupTemplate} from './view/popup-view.js';
import {createStatisticTemplate} from './view/statistic-view.js';
import {generateCardFilm} from './mock/film-card.js';

const FILM_COUNT = 5;
const cardsFilm = Array.from({length: FILM_COUNT}, generateCardFilm);
const siteHeaderElement = document.querySelector('.header');
// const siteFooterElement = document.querySelector('.footer');

renderTemplate(siteHeaderElement, createProfileTemplate(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector('.main');

renderTemplate(siteMainElement, createMainNavigationTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteMainElement, createSortTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteMainElement, createFilmsBlockTemplate(), RenderPosition.BEFOREEND);

const filmsBlock = siteMainElement.querySelector('.films');

renderTemplate(filmsBlock, createFilmsListTemplate(), RenderPosition.BEFOREEND);

const filmsList = siteMainElement.querySelector('.films-list__container');

for (let i=0; i< FILM_COUNT; i++) {
  renderTemplate(filmsList, createFilmCardTemplate(cardsFilm[i]), RenderPosition.BEFOREEND);
}

renderTemplate(siteMainElement, createStatisticTemplate(), RenderPosition.BEFOREEND);

// renderTemplate(siteFooterElement, createPopupTemplate(), RenderPosition.AFTEREND);
