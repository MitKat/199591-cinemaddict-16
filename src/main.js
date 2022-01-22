import {render, RenderPosition} from './utils/render.js';
import {generateCardFilm} from './mock/film-card.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';
import FooterView from './view/footer-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import StatisticView from './view/statistic-view.js';


const FILM_COUNT = 33;

const filmCards = Array.from({length: FILM_COUNT}, (_, i) => generateCardFilm(i+1));

const moviesModel = new MoviesModel();
moviesModel.movies = filmCards;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

render(siteMainElement, new MainNavigationView(), RenderPosition.BEFOREBEGIN);

const filterContainer = document.querySelector('.main-navigation');

const filterPresenter = new FilterPresenter(filterContainer, filterModel, moviesModel);

filterPresenter.init();

render(siteHeaderElement, new ProfileView(FILM_COUNT), RenderPosition.BEFOREEND);

const filmListPresenter = new FilmListPresenter(siteMainElement, moviesModel, filterModel);
filmListPresenter.init();

const statisticComponent = new StatisticView();

render(siteMainElement, statisticComponent, RenderPosition.BEFOREBEGIN);

render(siteFooterElement, new FooterView(filmCards.length), RenderPosition.BEFOREEND);
