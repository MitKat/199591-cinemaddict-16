import {remove, render, RenderPosition} from './utils/render.js';
// import {generateCardFilm} from './mock/film-card.js';
import {NavigationType, UpdateType} from './utils/const.js';
import MainNavigationView from './view/main-navigation-view.js';
import ProfileView from './view/profile-view.js';
import FooterView from './view/footer-view.js';
import FilmListPresenter from './presenter/film-list-presenter.js';
import MoviesModel from './model/movies-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import StatisticView from './view/statistic-view.js';
import ScreenModel from './model/screen-model.js';
import ApiService from './api-service.js';
import CommentsModel from './model/comments-model.js';

const AUTHORIZATION = 'Basic leof9797dnw04kr';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';
const apiService = new ApiService(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel(apiService);
const commentsModel = new CommentsModel(apiService);
const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

const mainNavigationComponent = new MainNavigationView();
const filmListPresenter = new FilmListPresenter(siteMainElement, moviesModel, filterModel, apiService, commentsModel);
let statisticComponent = new StatisticView(moviesModel.movies);
const screenModel = new ScreenModel();

render(siteMainElement, mainNavigationComponent, RenderPosition.BEFOREBEGIN);

const filterContainer = document.querySelector('.main-navigation');
const handleNavigationClick = (type) => {
  switch (type) {
    case NavigationType.FILM_LIST:
      if (screenModel.screen !== NavigationType.FILM_LIST) {
        screenModel.setScreen(UpdateType.PATCH, NavigationType.FILM_LIST);
        document.querySelector('.main-navigation__additional').classList.remove('main-navigation__additional--active');
        remove(statisticComponent);
        filmListPresenter.init();
      }
      break;
    case NavigationType.STATISTIC:
      if (screenModel.screen !== NavigationType.STATISTIC) {
        screenModel.setScreen(UpdateType.PATCH, NavigationType.STATISTIC);
        document.querySelector('.main-navigation__item--active').classList.remove('main-navigation__item--active');
        filmListPresenter.destroy();
        statisticComponent = new StatisticView(moviesModel.movies);
        render(siteMainElement, statisticComponent, RenderPosition.BEFOREBEGIN);
        document.querySelector('.main-navigation__additional').classList.add('main-navigation__additional--active');
      }
      break;
  }
};

const filterPresenter = new FilterPresenter(filterContainer, filterModel, moviesModel, handleNavigationClick);

mainNavigationComponent.setNavigationClickHandler(handleNavigationClick);

filterPresenter.init();

filmListPresenter.init();

moviesModel.init().finally(() => {
  render(siteHeaderElement, new ProfileView(moviesModel), RenderPosition.BEFOREEND);
  render(siteFooterElement, new FooterView(moviesModel.movies.length), RenderPosition.BEFOREEND);
});
