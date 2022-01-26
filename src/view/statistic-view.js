import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {GENRE, StatiscticType} from '../utils/const.js';
import {generateProfileRank} from '../utils/common.js';
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

const findGenreStatisic = (movies) => {
  const findGenre = (film, genre) => film.filmInfo.genre.find((filmGenre) => filmGenre === genre);
  const genreStat = GENRE.map((genre) => movies.filter((film) => findGenre(film, genre) === genre).length);

  return genreStat;
};

const findTopGenre = (genreStat) => {
  const maxGenreStat = Math.max.apply(null, genreStat);
  const topGenreIndex = genreStat.findIndex((genre) => genre === maxGenreStat);
  const topGenre = GENRE[topGenreIndex];

  return topGenre;
};

const findMoviesInPeriod = (watchedMovies, dateFrom, dateTo) => {
  const isWatchedInPeriod = (movie, from, to) => dayjs(movie.userDetails.watchingDate).isBetween(from, to);
  const moviesInPeriod = watchedMovies.filter((movie) => isWatchedInPeriod(movie, dateFrom, dateTo));
  return moviesInPeriod;
};

const renderDiagramChart = (statisticCtx, watchedMovies, dateFrom, dateTo) => {
  statisticCtx.height = BAR_HEIGHT * GENRE.length;
  const moviesInPeriod = findMoviesInPeriod(watchedMovies, dateFrom, dateTo);
  const genreStat = findGenreStatisic(moviesInPeriod);

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

const createStatisticTemplate = (watchedMovies, currentType, dateFrom, dateTo) => {
  const profileName = generateProfileRank(watchedMovies.length);
  const moviesInPeriod = findMoviesInPeriod(watchedMovies, dateFrom, dateTo);

  let genreStat = [0];
  let topGenre = '';
  let statWatched = 0;
  let hours = 0;
  let minutes = 0;

  if (moviesInPeriod.length !== 0) {
    genreStat = findGenreStatisic(moviesInPeriod);
    topGenre = findTopGenre(genreStat);
    statWatched = moviesInPeriod.length;

    const statTimeWatched = moviesInPeriod.map((film) => film.filmInfo.runTime).reduce((prevValue, curValue) => prevValue + curValue);
    hours = Math.floor(dayjs.duration(statTimeWatched, 'minutes').asHours(statTimeWatched));
    minutes = dayjs.duration(statTimeWatched, 'minutes').minutes(statTimeWatched);
  }

  const timeDuration = (hours===0)
    ? `${minutes}<span class="statistic__item-description">m</span>`
    : `${hours}<span class="statistic__item-description">h</span> ${minutes}<span class="statistic__item-description">m</span>`;

  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${profileName}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${StatiscticType.ALL}"
    ${currentType === StatiscticType.ALL ? 'checked' : ' '}>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${StatiscticType.TODAY}"
    ${currentType === StatiscticType.TODAY ? 'checked' : ' '}>
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${StatiscticType.WEEK}"
    ${currentType === StatiscticType.WEEK ? 'checked' : ' '}>
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${StatiscticType.MONTH}"
    ${currentType === StatiscticType.MONTH ? 'checked' : ' '}>
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${StatiscticType.YEAR}"
    ${currentType === StatiscticType.YEAR ? 'checked' : ' '}>
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
  #watchedMovies = [];
  #currentType = StatiscticType.ALL;

  constructor(movies) {
    super();

    this.#watchedMovies = movies.filter((film) => film.userDetails.isAlreadyWatched);
    this._data = {
      dateFrom: dayjs().subtract(PERIOD_STAT.ALL, 'year').toDate(),
      dateTo: dayjs().toDate(),
    };

    this.#setStatisticTypeChangeHandler();
    this.#setCharts();
  }

  get template() {
    return createStatisticTemplate(this.#watchedMovies, this.#currentType, this._data.dateFrom, this._data.dateTo);
  }

  removeElement = () => {
    super.removeElement();
  }

  restoreHandlers = () => {
    this.#setStatisticTypeChangeHandler();
    this.#setCharts();
  }

  #setStatisticTypeChangeHandler = () => {
    this.element.querySelector('.statistic__filters')
      .addEventListener('change', this.#statisticTypeChangeHandler);
  }

  #updateChangeTypeHandler = (date) => {
    const {dateFrom, dateTo} = date;

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

      this.#updateChangeTypeHandler(this._data);
    }

    if (type === StatiscticType.WEEK) {
      this.#currentType = StatiscticType.WEEK;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.ONE_WEEK, 'day').toDate();

      this.#updateChangeTypeHandler(this._data);
    }

    if (type === StatiscticType.MONTH) {
      this.#currentType = StatiscticType.MONTH;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.MONTH, 'month').toDate();

      this.#updateChangeTypeHandler(this._data);
    }

    if (type === StatiscticType.YEAR) {
      this.#currentType = StatiscticType.YEAR;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.YEAR, 'year').toDate();

      this.#updateChangeTypeHandler(this._data);
    }

    if (type === StatiscticType.ALL) {
      this.#currentType = StatiscticType.ALL;
      this._data.dateFrom = dayjs().subtract(PERIOD_STAT.ALL, 'year').toDate();
      this.#updateChangeTypeHandler(this._data);
    }

  }

  #setCharts = () => {
    const {dateFrom, dateTo} = this._data;
    const statisticCtx = this.element.querySelector('.statistic__chart');
    renderDiagramChart(statisticCtx, this.#watchedMovies, dateFrom, dateTo);
  }


}
