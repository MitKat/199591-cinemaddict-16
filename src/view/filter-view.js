import AbstractView from './abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="${name}" class= "${type === currentFilterType ?
      'main-navigation__item main-navigation__item--active' : 'main-navigation__item'}"
      name=${type}>
      ${name !== 'All movies' ?
      `${name} <span class="main-navigation__item-count">${count}</span>` : `${name}`}

    </a> `
  );
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};

export default class FilterView extends AbstractView {
  #filter = null;
  #currentFilter = null;

  constructor(filter, currentFilter) {
    super();
    this.#filter = filter;
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createFilterTemplate(this.#filter, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelectorAll('.main-navigation__item')
      .forEach((item) => item.addEventListener('click', this.#filterTypeChangeHandler));
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.name);
  }
}
