import {render, RenderPosition} from './utils/render.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateFilter} from './mock/filter-films.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';
import FooterView from './view/footer-view.js';

import FilmListPresenter from './presenter/film-list-presenter.js';

const FILM_COUNT = 33;

const filmCards = Array.from({length: FILM_COUNT}, (_, i) => generateCardFilm(i+1));
const filters = generateFilter(filmCards);

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

render(siteMainElement, new MainNavigationView(filters), RenderPosition.AFTERBEGIN);

render(siteHeaderElement, new ProfileView(filters), RenderPosition.BEFOREEND);

const filmListPresenter = new FilmListPresenter(siteMainElement);
filmListPresenter.init(filmCards);

render(siteFooterElement, new FooterView(filmCards.length), RenderPosition.BEFOREEND);
