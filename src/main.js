import {render, RenderPosition} from './utils/render.js';
import {generateCardFilm} from './mock/film-card.js';
import {generateFilter} from './mock/filter-films.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';
import FooterView from './view/footer-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import MoviesModel from './model/movies-model.js';


const FILM_COUNT = 33;

const filmCards = Array.from({length: FILM_COUNT}, (_, i) => generateCardFilm(i+1));
const filters = generateFilter(filmCards);

const moviesModel = new MoviesModel();
moviesModel.movies = filmCards;

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

render(siteMainElement, new MainNavigationView(filters), RenderPosition.BEFOREBEGIN);

render(siteHeaderElement, new ProfileView(filters), RenderPosition.BEFOREEND);

const filmListPresenter = new FilmListPresenter(siteMainElement, moviesModel);
filmListPresenter.init();

render(siteFooterElement, new FooterView(filmCards.length), RenderPosition.BEFOREEND);
