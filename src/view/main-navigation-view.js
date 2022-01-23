import AbstractView from './abstract-view.js';

const createMainNavigationTemplate = () => (
  `<nav class="main-navigation">



    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class MainNavigationView extends AbstractView {
  get template() {
    return createMainNavigationTemplate();
  }
}
