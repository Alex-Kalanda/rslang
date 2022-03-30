import { getUserWord, createUserWord, updateUserWord, getUserStat, putUserStat } from '../../components/api/api';
import { getUserId } from '../../utils/local-storage-helpers';
import { IStatistics, UserWord } from '../../interfaces';
import { DAY_24H } from '../../components/sprint/sprint-vars';

export async function lestenStateBtns(e: Event, wordId: string, wordState: UserWord) {
  const userId = getUserId();
  const targetState = wordState.difficulty as string;
  const btnElement = e.currentTarget as HTMLButtonElement;
  const cardElement = btnElement.parentElement?.parentElement?.parentElement as HTMLDivElement;

  const isHardActive = cardElement.classList.contains('hard') && targetState === 'hard';
  const isLearnedActive = cardElement.classList.contains('learned') && targetState === 'learned';
  const wordListElement = document.querySelector(`.word-item_active`) as HTMLButtonElement;

  wordListElement.classList.remove('word-item_hard', 'word-item_learned', 'word-item_easy');
  cardElement.classList.remove('learned', 'hard');

  async function createWord() {
    await createUserWord(userId, wordId, wordState);
  }

  async function updateWord() {
    await updateUserWord(userId, wordId, wordState);
  }

  async function setDefaultWordState() {
    await updateUserWord(userId, wordId, { difficulty: 'easy' });
  }

  const formStats = (newWordCountAdd: number, oldStats?: IStatistics): IStatistics => {

    let stats: IStatistics;
    const statsObj = {
      date: new Date(),
      newWords: 0,
      games: {
        sprint: {
          right: 0,
          wrong: 0,
          newWordsCountPerDay: 0,
          learnedWordsCountPerDay: 0,
          forgottenWordsCountPerDay: 0,
          maxCorrectSeriesPerDay: 0
        },
        audioCall: {
          right: 0,
          wrong: 0,
          newWordsCountPerDay: 0,
          learnedWordsCountPerDay: 0,
          forgottenWordsCountPerDay: 0,
          maxCorrectSeriesPerDay: 0
        }
      },
      newWordsDictionary: newWordCountAdd,
      learnedWordsDictionary: 1
    };
    if (oldStats) {
      const oldDate = oldStats?.optional.stat.stat[oldStats?.optional.stat.stat.length - 1].date;
      stats = Object.assign({}, oldStats);
      stats.learnedWords++;

      if (Math.floor(new Date(oldDate).getTime() / DAY_24H) < Math.floor(Date.now()  / DAY_24H)){
        stats.optional.stat.stat.push(statsObj);
      } else {
        stats.optional.stat.stat[stats.optional.stat.stat.length -1].newWordsDictionary += newWordCountAdd;
        stats.optional.stat.stat[stats.optional.stat.stat.length -1].learnedWordsDictionary++;
      }
    } else {
      stats = {
        learnedWords: 1,
        optional: {
          stat: {
            stat: [statsObj],
          },
        },
      };
    }
    return stats;
  };

  if (isHardActive || isLearnedActive) {
    await setDefaultWordState();
  } else {
    const isWordAlreadyAdded = await getUserWord(userId, wordId);

    cardElement.classList.toggle(targetState);
    wordListElement.classList.add(`word-item_${targetState}`);

    if (isWordAlreadyAdded) {

      await updateWord();
      if (targetState === 'learned'){
        const oldStats = await getUserStat(userId);
        const statistics = oldStats ? formStats(0, oldStats) : formStats(0);

        await putUserStat(userId, statistics);
      }
    } else {
      if (targetState === 'learned'){
        const oldStats = await getUserStat(userId);
        const statistics = oldStats ? formStats(1, oldStats) : formStats(1);

        await putUserStat(userId, statistics);
      }
      await createWord();
    }
  }
}
