import FilterView from '../view/filter-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, NavigationType, UpdateType} from '../utils/const.js';


export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;
  #screenModel = null;
  #handleNavigationClick;

  #filterComponent = null;

  constructor(filterContainer, filterModel, moviesModel, screenModel, handleNavigationClick) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#screenModel = screenModel;

    this.#handleNavigationClick = handleNavigationClick;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: movies.length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](movies).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](movies).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](movies).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#screenModel.screen === NavigationType.FILM_LIST && this.#filterModel.filter === filterType) {
      return;
    }
    this.#handleNavigationClick(NavigationType.FILM_LIST);
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
