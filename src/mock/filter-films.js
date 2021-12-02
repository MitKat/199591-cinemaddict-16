const filterWachlist = (films) => films.filter((film) => film.userDetails.isWatchlist).length;
const filterHistory = (films) => films.filter((film) => film.userDetails.isAlreadyWatched).length;
const filterFavorits = (films) => films.filter((film) => film.userDetails.isFavorite).length;

export const generateFilter = (films) => (
  {
    wachlist: filterWachlist(films),
    history: filterHistory(films),
    favorites: filterFavorits(films),

  }
);
