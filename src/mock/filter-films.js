const filterWatchlist = (films) => films.filter((film) => film.isWatchlist).length;
const filterHistory = (films) => films.filter((film) => film.isAlreadyWatched).length;
const filterFavorits = (films) => films.filter((film) => film.isFavorite).length;

export const generateFilter = (films) => (
  {
    wachlist: filterWatchlist(films),
    history: filterHistory(films),
    favorites: filterFavorits(films),

  }
);
