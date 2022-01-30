const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get movies() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  getComments = async (movieId) => {
    const response = await this.#load({
      url: `comments/${movieId}`,
      method: Method.GET,
    });
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  updateMovie = async (movie) => {
    const response = await this.#load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }


  #adaptToServer = (movie) => {
    const adaptedMovie = {...movie,
      ...movie.film_info, 'film_info': {
        ...movie.release, release: {
          ...movie.release,
          'release_country': movie.release.country,
        },
        ...movie.filmInfo,
        'age_rating': movie.filmInfo.ageRating,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'runtime': movie.filmInfo.runTime,
        'total_rating': movie.filmInfo.totalRating,
      },
      ...movie.user_details, 'user_details': {
        'already_watched': movie.userDetails.isAlreadyWatched,
        'favorite': movie.userDetails.isFavorite,
        'watchlist': movie.userDetails.isWatchlist,
        'watching_date': movie.userDetails.watchingDate,
      }
    };

    delete adaptedMovie.filmInfo;
    delete adaptedMovie.userDetails;
    delete adaptedMovie.film_info.ageRating;
    delete adaptedMovie.film_info.alternativeTitle;
    delete adaptedMovie.film_info.runTime;
    delete adaptedMovie.film_info.totalRating;
    delete adaptedMovie.user_details.isAlreadyWatched;
    delete adaptedMovie.user_details.isFavorite;
    delete adaptedMovie.user_details.isWatchlist;
    delete adaptedMovie.user_details.watchingDate;
    delete adaptedMovie.release;

    return adaptedMovie;
  }

  // #adaptToServer = (comment) => {
  //   const adaptedComment = {...comment,
  //     'comment': comment.text,
  //   };

  //   delete adaptedComment.text;

  //   return adaptedComment;
  // }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
