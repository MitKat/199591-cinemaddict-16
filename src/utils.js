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
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
