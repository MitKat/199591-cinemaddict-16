import dayjs from 'dayjs';
import {getRandomInteger} from '../utils';

const authors = [
  'Иван Иванов',
  'Петя Сидоров',
  'Марк Петров',
  'Лена Катина',
  'Ольга Иванова',
  'Василий',
  'Дарья Петрова',
];
const phrases = [
  'cool',
  'very cool',
  'simple',
  'very bad',
  'norm',
  'this ok',
];
const emoji = [
  'smile.png',
  'angry.png',
  'puke.png',
  'sleeping.png'
];
let commentId =1;

const getNextId = () => commentId++;

const generateCommentDate = () => {
  const maxDays = 30;
  const daysGap = getRandomInteger(0, -maxDays);

  return dayjs().add(daysGap, 'day').format('DD/MM/YYYY h:mm');
};

export const generateComment = () => (
  {
    id: getNextId(),
    author: authors[getRandomInteger(0, authors.length - 1)],
    text: phrases[getRandomInteger(1, phrases.length - 1)],
    emotion: emoji[getRandomInteger(1, emoji.length - 1)],
    date: generateCommentDate(),
  }
);
