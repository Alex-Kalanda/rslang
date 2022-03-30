import { IStatistics } from '../../../interfaces';
import { getUserId } from '../../../utils/local-storage-helpers';
import { getUserStat, putUserStat } from '../../../components/api/api';
import gameVars from './game-vars';
import { game } from '../../../components/sprint/sprint-store';

export const setStatistic = async (statData: IStatistics) => {
  await putUserStat(getUserId(), statData);
};

export const bestSeries = (arr: boolean[]): number => {
  const series: number[] = [];
  let counter = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      counter += 1;
      if (i === arr.length - 1) {
        series.push(counter);
      }
    } else {
      series.push(counter);
      counter = 0;
    }
  }
  return series.length ? Math.max(...series) : 0;
};

export const getObjectStatistic = async (answers: boolean[], wordStatus: string[]): Promise<IStatistics> => {
  let oldStats: IStatistics | void | undefined;
  let stats: IStatistics;

  if (getUserId()) oldStats = await getUserStat(getUserId());

  const right: number = answers.filter((i) => i).length;
  const wrong: number = answers.filter((i) => !i).length;
  const newWordsCountPerDay: number = wordStatus.filter((i) => i === 'new').length;
  const learnedWordsCountPerDay: number = wordStatus.filter((i) => i === 'learned').length;
  const forgottenWordsCountPerDay: number = wordStatus.filter((i) => i === 'forgotten').length;
  const maxCorrectSeriesPerDay: number = bestSeries(answers);

  const statsObj = {
    date: new Date(),
    newWords: newWordsCountPerDay,
    games: {
      sprint: {
        right: 0,
        wrong: 0,
        newWordsCountPerDay: 0,
        learnedWordsCountPerDay: 0,
        forgottenWordsCountPerDay: 0,
        maxCorrectSeriesPerDay: 0,
      },
      audioCall: {
        right,
        wrong,
        newWordsCountPerDay,
        learnedWordsCountPerDay,
        forgottenWordsCountPerDay,
        maxCorrectSeriesPerDay,
      },
    },
    newWordsDictionary: 0,
    learnedWordsDictionary: 0,
  };

  if (oldStats) {
    const oldDate = oldStats?.optional.stat.stat[oldStats?.optional.stat.stat.length - 1].date;

    const isNewDate =
      Math.floor(new Date(oldDate).getTime() / gameVars.diffTimeNewWord) <
      Math.floor(Date.now() / gameVars.diffTimeNewWord);
    if (!isNewDate) {
      stats = Object.assign({}, oldStats);
      const statsDay = stats.optional.stat.stat[stats.optional.stat.stat.length - 1];
      const statsDayAudioCall = statsDay.games.audioCall;
      stats.learnedWords = oldStats.learnedWords + learnedWordsCountPerDay;
      statsDay.newWords += newWordsCountPerDay;

      statsDayAudioCall.right += right;
      statsDayAudioCall.wrong += wrong;
      statsDayAudioCall.newWordsCountPerDay += newWordsCountPerDay;
      statsDayAudioCall.learnedWordsCountPerDay += learnedWordsCountPerDay;
      statsDayAudioCall.forgottenWordsCountPerDay += forgottenWordsCountPerDay;
      statsDayAudioCall.maxCorrectSeriesPerDay = maxCorrectSeriesPerDay;

      statsDay.newWordsDictionary =
        oldStats.optional.stat.stat[oldStats?.optional.stat.stat.length - 1].newWordsDictionary;
      statsDay.learnedWordsDictionary =
        oldStats.optional.stat.stat[oldStats?.optional.stat.stat.length - 1].learnedWordsDictionary;
    } else {
      stats = Object.assign({}, oldStats);
      stats.learnedWords = learnedWordsCountPerDay;
      stats.optional.stat.stat.push(statsObj);
    }
  } else {
    stats = {
      learnedWords: game.wordsListPlayed.length,
      optional: {
        stat: {
          stat: [statsObj],
        },
      },
    };
  }
  return stats;
};
