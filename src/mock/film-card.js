import dayjs from 'dayjs';
// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
//функция случайного числа с плавающей запятой
function getRandomFloatNumber(number1, number2, floatPoint) {
  if (number1 < 0 || number2 < 0) {
    return null;
  }
  const min = Math.min(number1, number2);
  const max = Math.max(number1, number2);
  const number = Math.random() * (max-min+1) + min;
  return number.toFixed(floatPoint);
}
const FLOAT_POINT_RATING = 1;
const MIN_RATING = 0.1;
const MAX_RATING = 9.9;

const generateTitle = () => {
  const titles = [
    'The Man with the Golden Arm',
    'Popeye the Sailor Meets Sindbad the Sailor',
    'Santa Claus Conquers the Martians',
    'Sagebrush Trail',
    'The Dance of Life',
    'Made for Each Other',
    'The Great Flamarion',
  ];

  const randomIndex = getRandomInteger(0, titles.length - 1);

  return titles[randomIndex];
};

const generateGenre = () => {
  const genres = [
    'Musical',
    'Comedy',
    'Mystery',
    'Drama',
    'Cartoon',
    'Western',
  ];

  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

const generateImage = () => {
  const images = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  ];

  const randomIndex = getRandomInteger(0, images.length - 1);

  return images[randomIndex];
};

const MAX_DISCRIPTION = 5;

const generateDescription =() => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const randomIndex = getRandomInteger(0, MAX_DISCRIPTION);

  let description='';
  for (let i=0; i< randomIndex; i++) {
    const index = getRandomInteger(0, descriptions.length - 1);
    description += descriptions[index];
  }
  return description;
};
// console.log(generateDiscription());

const MAX_AGE_RATING = 19;
const MAX_RUN_TIME_MINUTE = 240;

const MIN_YEAR = 1940;
const MAX_YEAR = 2022;

const generateYear = () => {
  const randomIndex = getRandomInteger(MIN_YEAR, MAX_YEAR);

  return dayjs().year(randomIndex);
};

export const generateCardFilm = () => {
  const releaseYear = generateYear();

  return {
    title: generateTitle(),
    poster: generateImage(),
    totalRating: getRandomFloatNumber(MIN_RATING, MAX_RATING, FLOAT_POINT_RATING),
    ageRating: getRandomInteger(0, MAX_AGE_RATING),
    runTime: getRandomInteger(0, MAX_RUN_TIME_MINUTE),
    releaseYear,
    genre: generateGenre(),
    description: generateDescription(),
  };
};
