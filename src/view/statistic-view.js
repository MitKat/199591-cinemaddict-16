import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {GENRE, FilterType, StatiscticType} from '../utils/const.js';
import {filter} from '../utils/filter.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(duration);
dayjs.extend(isBetween);

const BAR_HEIGHT = 50;

const PERIOD_STAT = {
  ALL: 200,
  ONE_DAY: 1,
  ONE_WEEK: 7,
  MONTH: 1,
  YEAR: 1,
};

const renderDiagramChart = (statisticCtx, genreStat, dateFrom, dateTo, watchedMovies) => {
  statisticCtx.height = BAR_HEIGHT * GENRE.length;
  // console.log(dateFrom);
  // console.log(dayjs(watchedMovies[3].userDetails.watchingDate));

  const isWatchedInPeriod = (movie, from, to) => dayjs(movie.userDetails.watchingDate).isBetween(from, to, 'year');
  // console.log(isWatchedInPeriod);

  const filteredMovies = watchedMovies.filter((movie) => isWatchedInPeriod(movie, dateFrom, dateTo));
  console.log(filteredMovies);

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

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${StatiscticType.ALL}" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${StatiscticType.TODAY}">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${StatiscticType.WEEK}">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${StatiscticType.MONTH}">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${StatiscticType.YEAR}">
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
  #currentType = StatiscticType.ALL;

  constructor(movies) {
    super();
    this.#movies = movies;
    this.#watchedMovies = filter[FilterType.HISTORY](movies);
    this._data = {
      dateFrom: dayjs().subtract(PERIOD_STAT.ALL, 'year'),
      dateTo: dayjs(),
    };

    const findGenre = (film, genre) => film.filmInfo.genre.find((filmGenre) => filmGenre === genre);
    this.#genreStat = GENRE.map((genre) => movies.filter((film) => findGenre(film, genre) === genre).length);
    const maxGenreStat = Math.max.apply(null, this.#genreStat);
    const topGenreIndex = this.#genreStat.findIndex((genre) => genre === maxGenreStat);
    this.#topGenre = GENRE[topGenreIndex];

    this.#setStatisticTypeChangeHandler();
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

  #setStatisticTypeChangeHandler = () => {
    this.element.querySelector('.statistic__filters')
      .addEventListener('change', this.#statisticTypeChangeHandler);
  }

  #updateChangeTypeHandler = (date) => {
    const {dateFrom, dateTo} = date;
    if (!dateFrom || !dateTo) {
      return;
    }
    this.updateData({
      dateFrom,
      dateTo,
    });
  }

  #statisticTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const type = evt.target.value;

    if (type === StatiscticType.TODAY) {
      this.#currentType = StatiscticType.TODAY;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.ONE_DAY, 'day').toDate();

      this.#updateChangeTypeHandler();
    }

    if (type === StatiscticType.WEEK) {
      this.#currentType = StatiscticType.WEEK;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.ONE_WEEK, 'day').toDate();

      this.#updateChangeTypeHandler();
    }

    if (type === StatiscticType.MONTH) {
      this.#currentType = StatiscticType.MONTH;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.MONTH, 'month').toDate();

      this.#updateChangeTypeHandler();
    }

    if (type === StatiscticType.YEAR) {
      this.#currentType = StatiscticType.YEAR;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.YEAR, 'year').toDate();
      this.#updateChangeTypeHandler();
    }


    if (type === StatiscticType.ALL) {
      this.#currentType = StatiscticType.ALL;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.ALL, 'year').toDate();
      this.#updateChangeTypeHandler();
    }

  }

  #setCharts = () => {
    const {dateFrom, dateTo} = this._data;
    const statisticCtx = this.element.querySelector('.statistic__chart');
    renderDiagramChart(statisticCtx, this.#genreStat, dateFrom, dateTo, this.#watchedMovies);
  }


}
