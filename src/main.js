import {renderTemplate, RenderPosition} from './render.js';
import {createMainNavigationTemplate} from './view/main-navigation-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createProfileTemplate} from './view/profile-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createFilmsListTemplate} from './view/films-list-view.js';
import {createFilmsBlockTemplate} from './view/films-block-view.js';
// import {createPopupTemplate} from './view/popup-view.js';
import {createStatisticTemplate} from './view/statistic-view.js';

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

for (let i=0; i< 5; i++) {
  renderTemplate(filmsList, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(siteMainElement, createStatisticTemplate(), RenderPosition.BEFOREEND);

// renderTemplate(siteFooterElement, createPopupTemplate(), RenderPosition.AFTEREND);
