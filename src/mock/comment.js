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

const generateCommentDate = () => {
  const maxDays = 30;
  const daysGap = getRandomInteger(0, -maxDays);

  return dayjs().add(daysGap, 'day').toDate().format('YYYY/MMMM/DD h:mm');
};

const generateAuthor = () => {
  const randomIndex = getRandomInteger(0, authors.length - 1);
  return authors[randomIndex];
};

export const generateComment = () => (
  {
    id: 1,
    author: generateAuthor(),
    comment: '',
    date: generateCommentDate(),
  }
);
