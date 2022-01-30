import dayjs from 'dayjs';

const RankValue = {
  MIN: 0,
  MIDDLE: 10,
  MAX: 20,
};
// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
//функция случайного числа с плавающей запятой
export function getRandomFloatNumber(number1, number2, floatPoint) {
  if (number1 < 0 || number2 < 0) {
    return null;
  }
  const min = Math.min(number1, number2);
  const max = Math.max(number1, number2);
  const number = Math.random() * (max-min+1) + min;
  return number.toFixed(floatPoint);
}
// функция взята с просторов интернета
export function shuffle(array) {
  const arrayCopy = array.slice();
  let currentIndex = arrayCopy.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [arrayCopy[currentIndex], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex], arrayCopy[currentIndex]];
  }
  return arrayCopy;
}

export const generateProfileRank = (history) => {
  let profileName = 'Movie Buff';
  if (history === RankValue.MIN) {
    profileName = '';
  } else if (history <= RankValue.MIDDLE) {
    profileName = 'Novice';
  } else if (history > RankValue.MIDDLE && history <= RankValue.MAX) {
    profileName = 'Fan';
  }
  return profileName;
};

export const sortDateFunction = (filmA, filmB) => {
  const countA = dayjs(filmA.release.date).format('YYYY');
  const countB = dayjs(filmB.release.date).format('YYYY');
  return countB - countA;
};

export const sortRatingFunction = (filmA, filmB) => {
  const countA = filmA.filmInfo.totalRating;
  const countB = filmB.filmInfo.totalRating;
  return countB - countA;
};

