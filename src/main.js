import {remove, render, RenderPosition} from './utils/render.js';
import {generateCardFilm} from './mock/film-card.js';
import {NavigationType} from './utils/const.js';
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

const mainNavigationComponent = new MainNavigationView();

render(siteMainElement, mainNavigationComponent, RenderPosition.BEFOREBEGIN);

const filterContainer = document.querySelector('.main-navigation');

const filterPresenter = new FilterPresenter(filterContainer, filterModel, moviesModel);


render(siteHeaderElement, new ProfileView(filmCards), RenderPosition.BEFOREEND);

const filmListPresenter = new FilmListPresenter(siteMainElement, moviesModel, filterModel);


const statisticComponent = new StatisticView(filmCards);


const handleNavigationClick = (type) => {
  switch (type) {
    case NavigationType.FILM_LIST:
      document.querySelector('.main-navigation__additional').classList.remove('main-navigation__additional--active');
      remove(statisticComponent);
      filmListPresenter.init();
      break;
    case NavigationType.STATISTIC:
      filmListPresenter.destroy();
      render(siteMainElement, statisticComponent, RenderPosition.BEFOREBEGIN);
      document.querySelector('.main-navigation__additional').classList.add('main-navigation__additional--active');
      break;
  }
};

mainNavigationComponent.setNavigationClickHandler(handleNavigationClick);

filterPresenter.init();

filmListPresenter.init();


render(siteFooterElement, new FooterView(filmCards.length), RenderPosition.BEFOREEND);
