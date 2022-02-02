import dayjs from 'dayjs';

const RankValue = {
  MIN: 0,
  MIDDLE: 10,
  MAX: 20,
};

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

export const sortCommentLengthFunction = (filmA, filmB) => {
  const countA = filmA.comments.length;
  const countB = filmB.comments.length;
  return countB - countA;
};

