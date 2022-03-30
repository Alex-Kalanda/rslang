import { UserWord, UserWordWithIds, WordExtended } from '../../../interfaces';
import gameVars from './game-vars';
import { createUserWord, getUserWord, updateUserWord } from '../../../components/api/api';
import { getUserId } from '../../../utils/local-storage-helpers';

const updateWord = (word: WordExtended, ans: boolean): void => {
  const date = new Date();
  let right: number;
  let wrong: number;
  let amount: number;
  let newField: boolean | undefined;

  function isNew(curTime: number, oldTime: number, diffTime: number): boolean {
    return curTime - oldTime < diffTime;
  }
  function getDiff(amountRightAns: number, type: string | undefined): string {
    switch (type) {
      case 'learned':
        return amountRightAns > 4 ? 'learned' : 'easy';
      case 'hard':
        return amountRightAns > 4 ? 'learned' : 'hard';
      case 'easy':
        return amountRightAns > 2 ? 'learned' : 'easy';
      default:
        return 'easy';
    }
  }
  const initOpt: UserWord = {
    difficulty: 'easy',
    optional: {
      addTime: date.getTime(),
      new: true,
      games: {
        sprint: {
          right: 0,
          wrong: 0,
        },
        audioCall: {
          right: ans ? 1 : 0,
          wrong: ans ? 0 : 1,
        },
        correctAnswerSeries: ans ? 1 : 0,
      },
    },
  };

  createUserWord(getUserId(), word.id, initOpt).then((response: Response | void) => {
    //status 417 >>> if word already exist
    if (response && response.status === 417) {
      getUserWord(getUserId(), word.id).then(async (userWord: UserWordWithIds | void) => {
        if (userWord) {
          const series: number = userWord.optional?.games?.correctAnswerSeries || 0;
          const diff: string | undefined = getDiff(series, userWord.difficulty);

          if (userWord.optional?.addTime) {
            newField = isNew(date.getTime(), userWord.optional?.addTime, gameVars.diffTimeNewWord);
          }
          if (userWord.optional?.games?.audioCall) {
            const old: number = userWord.optional?.games?.audioCall?.right || 0;
            right = ans ? old + 1 : old;
          }
          if (userWord.optional?.games?.audioCall) {
            const old: number = userWord.optional?.games?.audioCall?.wrong || 0;
            wrong = ans ? old : old + 1;
          }
          if (userWord.optional?.games?.correctAnswerSeries) {
            const old: number = userWord.optional?.games?.correctAnswerSeries;
            amount = ans ? old + 1 : 0;
          }

          if (userWord.difficulty === 'learned' && diff !== 'learned') {
            gameVars.wordsStatus.push('forgotten');
          }
          if (userWord.difficulty !== 'learned' && diff === 'learned') {
            gameVars.wordsStatus.push('learned');
          }

          const updateOpt: UserWord = {
            difficulty: diff,
            optional: {
              addTime: userWord.optional?.addTime,
              new: newField,
              games: {
                sprint: {
                  right: userWord.optional?.games?.sprint?.right || 0,
                  wrong: userWord.optional?.games?.sprint?.wrong || 0,
                },
                audioCall: {
                  right: right,
                  wrong: wrong,
                },
                correctAnswerSeries: amount,
              },
            },
          };
          await updateUserWord(getUserId(), word.id, updateOpt);
        }
      });
    } else {
      gameVars.wordsStatus.push('new');
    }
  });
};

export default updateWord;
