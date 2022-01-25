import dayjs from 'dayjs';
import { getRandomFloatNumber, getRandomInteger, shuffle } from '../utils/common.js';
import {generateComment} from './comment';
const FLOAT_POINT_RATING = 1;
const MIN_RATING = 0.1;
const MAX_RATING = 9.9;
const MAX_DISCRIPTION = 5;
const MAX_AGE_RATING = 19;
const MAX_RUN_TIME_MINUTE = 240;
const MIN_YEAR = 1940;
const MAX_YEAR = 2022;
const COUNT_COMMENT = 10;

const titles = [
  'The Man with the Golden Arm',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Santa Claus Conquers the Martians',
  'Sagebrush Trail',
  'The Dance of Life',
  'Made for Each Other',
  'The Great Flamarion',
];
const alternativeTitles = [
  'The Great Flamarion',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'Santa Claus Conquers the Martians',
  'Sagebrush Trail',
  'The Dance of Life',
  'Made for Each Other',
  'The Great Flamarion',
];
const genres = [
  'Drama',
  'Thriller',
  'Animation',
  'Adventure',
  'Family',
  'Sci-Fi',
  'Action',
  'Horror',
  'Comedy',
];
const images = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];
const people = [
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Anthony Mann',
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
];
const countries = [
  'Russia',
  'Dania',
  'Sweden',
  'Finland',
  'Genmark',
  'Italia',
  'Ispania',
  'Portugalia',
  'USA',
  'China',
];
const descriptions = [
  ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  ' Cras aliquet varius magna, non porta ligula feugiat eget.',
  ' Fusce tristique felis at fermentum pharetra.',
  ' Aliquam id orci ut lectus varius viverra.',
  ' Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  ' Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  ' Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  ' Sed sed nisi sed augue convallis suscipit in sed felis.',
  ' Aliquam erat volutpat.',
  ' Nunc fermentum tortor ac porta dapibus.',
  ' In rutrum ac purus sit amet tempus.',
];

const generateTitle = () => {
  const randomIndex = getRandomInteger(0, titles.length - 1);
  return titles[randomIndex];
};
const generateAlternativeTitle = () => {
  const randomIndex = getRandomInteger(0, alternativeTitles.length - 1);
  return alternativeTitles[randomIndex];
};

const generateGenres = () => {
  const randomIndex = getRandomInteger(1, genres.length - 1);
  const genresShuffle = shuffle(genres.slice());
  return genresShuffle.slice(0, randomIndex);
};
const generateActors = () => {
  const randomIndex = getRandomInteger(1, people.length - 1);
  const actors = shuffle(people.slice());
  return actors.slice(0, randomIndex);
};
const generateDirector = () => {
  const randomIndex = getRandomInteger(1, people.length - 1);
  return people[randomIndex];
};
const generateImage = () => {
  const randomIndex = getRandomInteger(0, images.length - 1);
  return images[randomIndex];
};
const generateCountry = () => {
  const randomIndex = getRandomInteger(0, countries.length - 1);
  return countries[randomIndex];
};

const generateDescription =() => {
  const randomIndex = getRandomInteger(0, MAX_DISCRIPTION);

  const description = shuffle(descriptions.slice());
  return description.slice(0, randomIndex).join(' ');
};

const generateDateRelease = () => {
  const randomDay = getRandomInteger(0, 31);
  const randomMonth = getRandomInteger(1, 12);
  const randomYear = getRandomInteger(MIN_YEAR, MAX_YEAR);

  return dayjs().add(randomDay, 'day').add(randomMonth, 'month').year(randomYear);
};

const generateWatchingDate = () => {
  const randomDay = getRandomInteger(0, 31);
  const randomMonth = getRandomInteger(11, 12);
  const randomYear =  2021;

  return dayjs().add(randomDay, 'day').add(randomMonth, 'month').year(randomYear);
};

const generateCommentsList = () => {
  const count = getRandomInteger(0, COUNT_COMMENT);
  const comments = Array.from({length: count}, generateComment);
  return comments;
};

export const generateCardFilm = (id) => (
  {
    id,
    comments: generateCommentsList(),
    filmInfo: {
      title: generateTitle(),
      alternativeTitle: generateAlternativeTitle(),
      totalRating: getRandomFloatNumber(MIN_RATING, MAX_RATING, FLOAT_POINT_RATING),
      poster: generateImage(),
      ageRating: getRandomInteger(0, MAX_AGE_RATING),
      director: generateDirector(),
      writers: generateActors(),
      actors: generateActors(),
      runTime: getRandomInteger(0, MAX_RUN_TIME_MINUTE),
      genre: generateGenres(),
      description: generateDescription(),
    },
    release : {
      date: generateDateRelease(),
      country: generateCountry(),
    },
    userDetails: {
      isWatchlist: Boolean(getRandomInteger(0, 1)),
      isAlreadyWatched: Boolean(getRandomInteger(0, 1)),
      isFavorite: Boolean(getRandomInteger(0, 1)),
      watchingDate: generateWatchingDate(),
    },
  }
);
