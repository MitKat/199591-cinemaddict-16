import {renderTemplate, RenderPosition} from './render.js';
import {createMainNavigationTemplate} from './view/main-navigation-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createProfileTemplate} from './view/profile-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createFilmsListTemplate} from './view/films-list-view.js';
import {createFilmsBlockTemplate} from './view/films-block-view.js';
import {createButtonShowMoreTemplate} from './view/button-show-more-view.js';
import {createPopupTemplate} from './view/popup-view.js';
import {createStatisticTemplate} from './view/statistic-view.js';
import {createFooterTemplate} from './view/footer-view.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateFilter} from './mock/filter-films.js';
import {createCommentsPopupTemplate} from './view/comments-view.js';
import {createNewCommentTemplate} from './view/new-comment-view.js';


const FILM_COUNT = 28;
const FILM_COUNT_STEP = 5;
const filmCards = Array.from({length: FILM_COUNT}, (_, i) => generateCardFilm(i+1));

console.log(filmCards);
const filters = generateFilter(filmCards);

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
  renderTemplate(filmsList, createFilmCardTemplate(filmCards[i]), RenderPosition.BEFOREEND);
}


if (filmCards.length > FILM_COUNT_STEP) {
  let renderedFilmCount = FILM_COUNT_STEP;
  renderTemplate(filmsBlock, createButtonShowMoreTemplate(), RenderPosition.BEFOREEND);

  const ButtonShowMore = filmsBlock.querySelector('.films-list__show-more');

  ButtonShowMore.addEventListener('click', (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_STEP)
      .forEach((film) => renderTemplate(filmsList, createFilmCardTemplate(film), RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_STEP;

    if (renderedFilmCount >= filmCards.length) {
      ButtonShowMore.remove();
    }
  });
}

renderTemplate(siteMainElement, createStatisticTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteFooterElement, createPopupTemplate(filmCards[0]), RenderPosition.AFTEREND);
const popupComments = document.querySelector('.film-details__bottom-container');
renderTemplate(popupComments, createCommentsPopupTemplate(filmCards[0]), RenderPosition.BEFOREEND);
renderTemplate(popupComments, createNewCommentTemplate(), RenderPosition.BEFOREEND);

renderTemplate(siteFooterElement, createFooterTemplate(filmCards.length), RenderPosition.BEFOREEND);
