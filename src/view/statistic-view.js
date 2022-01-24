import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {GENRE, FilterType} from '../utils/const.js';
import {filter} from '../utils/filter.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const BAR_HEIGHT = 50;

const renderDiagramChart = (statisticCtx, genreStat) => {
  statisticCtx.height = BAR_HEIGHT * GENRE.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: GENRE,
      datasets: [{
        data: genreStat,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticTemplate = (watchedMovies, topGenre) => {

  const statWatched = watchedMovies.length;

  const statTimeWatched = watchedMovies.map((film) => film.filmInfo.runTime).reduce((prevValue, curValue) => prevValue + curValue);
  const hours = Math.floor(dayjs.duration(statTimeWatched, 'minutes').asHours(statTimeWatched));
  const minutes = dayjs.duration(statTimeWatched, 'minutes').minutes(statTimeWatched);
  const timeDuration = (hours===0)
    ? `${minutes}<span class="statistic__item-description">m</span>`
    : `${hours}<span class="statistic__item-description">h</span> ${minutes}<span class="statistic__item-description">m</span>`;

  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">Movie buff</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${statWatched} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${timeDuration}</p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class StatisticView extends SmartView {
  #movies = null;
  #topGenre = '';
  #genreStat = [];
  #watchedMovies = [];

  constructor(movies) {
    super();
    this.#movies = movies;
    this.#watchedMovies = filter[FilterType.HISTORY](movies);
    // watchedMovies.filter((movie) => movie.userDetails.watchingDate)

    const findGenre = (film, genre) => film.filmInfo.genre.find((filmGenre) => filmGenre === genre);
    this.#genreStat = GENRE.map((genre) => movies.filter((film) => findGenre(film, genre) === genre).length);
    const maxGenreStat = Math.max.apply(null, this.#genreStat);
    const topGenreIndex = this.#genreStat.findIndex((genre) => genre === maxGenreStat);
    this.#topGenre = GENRE[topGenreIndex];

    this.#setCharts();
  }

  get template() {
    return createStatisticTemplate(this.#watchedMovies, this.#topGenre);
  }

  removeElement = () => {
    super.removeElement();
  }

  restoreHandlers = () => {
    this.#setCharts();
  }

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');
    renderDiagramChart(statisticCtx, this.#genreStat);
  }


}
