import { game, initStore } from './sprint-store';
import { getRandom } from '../../utils/calc';
import {
  DAY_24H,
  EASY_SERIES,
  HARD_SERIES,
  MULT_INC_TRIGGER,
  MULT_INC_TRIGGER_STEP,
  SCORE_ADDITION,
  TOTAL_PAGES_PER_GROUP,
  WORDS_PER_PAGE
} from './sprint-vars';
import { createUserWord, getUserAggregatedWords, getUserStat, getWords, putUserStat, updateUserWord } from '../api/api';
import { addElement, addTextElement } from '../../utils/add-element';
import { WordsList } from '../../types';
import { shuffledArray } from '../../utils/modify-arrays';
import { IStatistics, IWordsListResult, SprintGameResults, UserWord, WordExtended } from '../../interfaces';
import { audioPlay, wordPlay } from './sprint-sounds';
import { showModal } from '../../utils/show-modal';
import { exitFullScreen, isFullScreen } from '../../utils/fullscreen';

const formStatistics = (finalResultsData: SprintGameResults, oldStats?: IStatistics): IStatistics => {
  let stats: IStatistics;
  const statsObj = {
    date: new Date(),
    newWords: game.newWordsCount,
    games: {
      sprint: {
        right: finalResultsData.right,
        wrong: finalResultsData.wrong,
        newWordsCountPerDay: game.newWordsCount,
        learnedWordsCountPerDay: game.learnedWordsCount,
        forgottenWordsCountPerDay: game.forgottenWordsCount,
        maxCorrectSeriesPerDay: game.maxCorrectSequence
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
    newWordsDictionary: 0,
    learnedWordsDictionary: 0
  };
  if (oldStats) {
    const oldDate = oldStats?.optional.stat.stat[oldStats?.optional.stat.stat.length - 1].date;
    if (Math.floor(new Date(oldDate).getTime() / DAY_24H) === Math.floor(Date.now()  / DAY_24H)) {
      stats = Object.assign({}, oldStats);
      const statsDay = stats.optional.stat.stat[stats.optional.stat.stat.length - 1];
      const statsDaySprint = statsDay.games.sprint;
      stats.learnedWords = oldStats.learnedWords + game.wordsListPlayed.length;
      statsDay.newWords += game.newWordsCount;
      statsDaySprint.right += finalResultsData.right;
      statsDaySprint.wrong += finalResultsData.wrong;
      statsDaySprint.newWordsCountPerDay += game.newWordsCount;
      statsDaySprint.learnedWordsCountPerDay += game.learnedWordsCount;
      statsDaySprint.forgottenWordsCountPerDay += game.forgottenWordsCount;
      statsDaySprint.maxCorrectSeriesPerDay = Math.max(statsDaySprint.maxCorrectSeriesPerDay, game.maxCorrectSequence);
    } else {
      stats = Object.assign({}, oldStats);
      stats.learnedWords = game.wordsListPlayed.length;
      stats.optional.stat.stat.push(statsObj);
    }
  } else {
    stats = {
      learnedWords: game.wordsListPlayed.length,
      optional: {
        stat: {
          stat: [statsObj]
        }
      }
    };
  }
  return stats;
};
const saveStatistics = async (finalResultsData: SprintGameResults): Promise<void> => {
  const oldStats = await getUserStat(game.userId);
  const statistics = oldStats ? formStatistics(finalResultsData, oldStats) : formStatistics(finalResultsData);
  await putUserStat(game.userId, statistics);
};
export const clearGame = (): void => {
  game.music?.pause();
  clearInterval(game.timerInterval);
  document.removeEventListener('keyup', game.keyHandlerStart);
  document.removeEventListener('keyup', game.keyHandlerQuestions);
  window.removeEventListener('hashchange', clearGame);
  initStore();
  game.isFinished = true;
};
export const initWordsListDictionary = async (): Promise<void> => {
  if (!game.userId) game.wordsList = await getWords(game.group, game.page);
  else {
    game.isFromDictionary = true;
    const res = await getUserAggregatedWords(
      game.userId,
      undefined,
      undefined,
      `${WORDS_PER_PAGE}`,
      `{"$and":[{"$or":[{"userWord.difficulty":"easy"}, {"userWord.difficulty":"hard"}, {"userWord":null}]},
        {"group":${game.group}}, {"page":${game.page}}]}`);
    game.wordsList = res ? res.wordsList : [];
  }
};
export const initWordsListMenu = async (group: number) => {
  game.page = `${getRandom(TOTAL_PAGES_PER_GROUP)}`;
  game.group = `${group}`;
  if (!game.userId) game.wordsList = await getWords(game.group, game.page);
  else {
    const res = await getUserAggregatedWords(
      game.userId,
      undefined,
      undefined,
      `${WORDS_PER_PAGE}`,
      `{"$and":[{"group":${game.group}}, {"page":${game.page}}]}`);
    game.wordsList = res ? res.wordsList : [];
  }
};
export const getWrongAnswer = (right: string, answersList: string[]): string => {
  const answers = [...answersList];
  answers.splice(answers.indexOf(right), 1);
  return answers[getRandom(answers.length)];
};
const calcFinalResults = (): SprintGameResults => {
  let right = 0;
  let wrong = 0;
  const wrongAnswers: IWordsListResult[] = [];
  const rightAnswers: IWordsListResult[] = [];

  game.wordsListPlayed.forEach((item: WordExtended, index: number) => {
    const word: IWordsListResult = {
      sound: item.audio,
      word: item.word,
      translate: item.wordTranslate
    };
    if (game.userAnswers[index]) {
      right++;
      rightAnswers.push(word);
    } else {
      wrong++;
      wrongAnswers.push(word);
    }
  });

  const message = '';
  const result = {
    score: game.score,
    message: message,
    right: right,
    wrong: wrong,
    sequence: game.maxCorrectSequence,
    percent: (right / (right + wrong)) * 100 || 0,
    wrongAnswers: wrongAnswers,
    rightAnswers: rightAnswers
  };
  return result;
};
export const finishSprint = async (): Promise<void> => {
  document.removeEventListener('keyup', game.keyHandlerQuestions);
  game.isFinished = true;
  if (isFullScreen()) exitFullScreen(document);
  const finalResultsData: SprintGameResults = calcFinalResults();
  if (game.userId) await saveStatistics(finalResultsData);
  const finalContainer = addElement('div', 'sprint-final');
  const finalBtnsContainer = addElement('div', 'sprint-final-btns-container');
  const finalResultsBtn = addTextElement('button', 'btn-sprint-final', 'Результат');
  finalResultsBtn.classList.add('sprint-active');
  const finalWordsBtn = addTextElement('button', 'btn-sprint-final', 'Посмотреть слова');

  const finalContainerInfo = addElement('div', 'sprint-final-info');
  const finalResults = addElement('div', 'sprint-final-results');
  const finalWords = addElement('div', 'sprint-final-words');


  const finalResultsScoreContainer = addTextElement('div', 'sprint-final-score-container', 'Score -');
  const finalResultsScore = addTextElement('span', 'sprint-final-score', `${finalResultsData.score}`);
  const finalResultsMessage = addTextElement('div', 'sprint-final-massage', finalResultsData.message);

  const finalResultsWordsRightContainer = addTextElement('div', 'sprint-final-right-container', 'Правильных ответов:');
  const finalResultsWordsRight = addTextElement('span', 'sprint-final-words-right', `${finalResultsData.right}`);
  const finalResultsWordsWrongContainer = addTextElement('div', 'sprint-final-wrong-container', 'Неправильных ответов:');
  const finalResultsWordsWrong = addTextElement('span', 'sprint-final-words-wrong', `${finalResultsData.wrong}`);

  const finalResultsSequenceContainer = addTextElement('div', 'sprint-final-sequence-container',
    'Лучшая серия правильных ответов - ');
  const finalResultsSequence = addTextElement('span', 'sprint-final-sequence', `${finalResultsData.sequence}`);
  const finalResultsPercentContainer = addElement('div', 'sprint-final-percent-container');
  const finalResultsPercent = addElement('div', 'global');
  finalResultsPercent.setAttribute('data-pie', `{ "percent": ${finalResultsData.percent} }`);

  const finalWordsMistakesContainer = addElement('div', 'sprint-final-mistakes-container');
  const finalWordsMistakesCountContainer = addTextElement('div', 'sprint-final-mistakes-count-container', 'Ошибки: ');
  const finalWordsMistakesCount = addTextElement('span', 'sprint-final-mistakes-count', `${finalResultsData.wrong}`);
  const finalWordsMistakes = addElement('div', 'sprint-final-mistakes');

  const finalWordsCorrectContainer = addElement('div', 'sprint-final-correct-container');
  const finalWordsCorrectCountContainer = addTextElement('div', 'sprint-final-correct-count-container',
    'Правильные ответы: ');
  const finalWordsCorrectCount = addTextElement('span', 'sprint-final-correct-count', `${finalResultsData.right}`);
  const finalWordsCorrect = addElement('div', 'sprint-final-correct');
  const setActiveFinalResults = () => {
    if (finalContainerInfo.classList.contains('sprint-final-info-moveRight')) {
      finalContainerInfo.classList.remove('sprint-final-info-moveRight');
    }
    if (!finalResultsBtn.classList.contains('sprint-active')) {
      finalContainerInfo.classList.add('sprint-final-info-moveLeft');
      finalResultsBtn.classList.add('sprint-active');
    }
    if (finalWordsBtn.classList.contains('sprint-active')) finalWordsBtn.classList.remove('sprint-active');
  };
  const setActiveFinalWords = () => {
    if (finalContainerInfo.classList.contains('sprint-final-info-moveLeft')) {
      finalContainerInfo.classList.remove('sprint-final-info-moveLeft');
    }
    if (!finalWordsBtn.classList.contains('sprint-active')) {
      finalContainerInfo.classList.add('sprint-final-info-moveRight');
      finalWordsBtn.classList.add('sprint-active');
    }
    if (finalResultsBtn.classList.contains('sprint-active')) finalResultsBtn.classList.remove('sprint-active');
  };
  const keyHandlerFinal = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setActiveFinalResults();
    if (e.key === 'ArrowRight') setActiveFinalWords();
  };

  const formWordList = (container: HTMLElement, wordsList: IWordsListResult[]) => {
    wordsList.forEach(item => {
      const itemContainer = addElement('div', 'sprint-item-card');
      const itemSound = addElement('span', 'sprint-item-sound');
      itemSound.addEventListener('click', async () => {
        await wordPlay(`${item.sound}`);
      });
      const itemWord = addTextElement('span', 'sprint-item-word', `${item.word}`);
      const itemTranslate = addTextElement('span', 'sprint-item-translate', `${item.translate}`);
      itemContainer.append(itemSound, itemWord, itemTranslate);
      container.append(itemContainer);
    });
  };
  formWordList(finalWordsMistakes, finalResultsData.wrongAnswers);
  formWordList(finalWordsCorrect, finalResultsData.rightAnswers);

  finalWordsMistakesCountContainer.append(finalWordsMistakesCount);
  finalWordsMistakesContainer.append(finalWordsMistakesCountContainer, finalWordsMistakes);
  finalWordsCorrectCountContainer.append(finalWordsCorrectCount);
  finalWordsCorrectContainer.append(finalWordsCorrectCountContainer, finalWordsCorrect);
  finalResultsWordsWrongContainer.append(finalResultsWordsWrong);
  finalResultsWordsRightContainer.append(finalResultsWordsRight);
  finalResultsScoreContainer.append(finalResultsScore);
  finalResultsSequenceContainer.append(finalResultsSequence);
  finalResultsPercentContainer.append(finalResultsPercent);
  finalResults.append(
    finalResultsScoreContainer,
    finalResultsMessage,
    finalResultsWordsWrongContainer,
    finalResultsWordsRightContainer,
    finalResultsSequenceContainer,
    finalResultsPercentContainer
  );
  finalWords.append(finalWordsMistakesContainer, finalWordsCorrectContainer);
  finalBtnsContainer.append(finalResultsBtn, finalWordsBtn);
  finalContainerInfo.append(finalResults, finalWords);
  finalContainer.append(finalBtnsContainer, finalContainerInfo);

  document.addEventListener('keyup', keyHandlerFinal);
  finalResultsBtn.addEventListener('click', setActiveFinalResults);
  finalWordsBtn.addEventListener('click', setActiveFinalWords);

  setTimeout(() => {
    const globalConfig = {
      'lineargradient': ['yellow', '#ff0000'],
      'round': true,
      'colorCircle': '#e6e6e6',
      'speed': 24
    };
    const global = new CircularProgressBar('global', globalConfig);
    global.initial();
  }, 1500);
  setTimeout(async () => {
    await showModal(finalContainer, 'sprint');
  }, 1000);
  await audioPlay('Finish');
  clearGame();
};
export const addWordsForSprint = async (): Promise<WordsList> => {
  let wordsList: WordsList;
  if (+game.page === 0) {
    await finishSprint();
    wordsList = [];
  } else {
    if (!game.userId) {
      wordsList = await getWords(`${game.group}`, `${+game.page - 1}`);
    } else {
      const filterQuery = game.isFromDictionary
        ? `{"$and":[{"$or":[{"userWord.difficulty":"easy"}, {"userWord.difficulty":"hard"}, {"userWord":null}]},
         {"group":${game.group}}, {"page":${+game.page - 1}}]}`
        : `{"$and":[{"group":${game.group}}, {"page":${+game.page - 1}}]}`;
      const res = await getUserAggregatedWords(game.userId, undefined, undefined, `${WORDS_PER_PAGE}`, filterQuery);
      wordsList = res ? res.wordsList : [];
    }
    if (wordsList.length === 0) {
      game.page = `${+game.page - 1}`;
      wordsList = await addWordsForSprint();
    }
    shuffledArray(wordsList);
    game.answersList = [];
    wordsList.forEach(word => game.answersList.push(word.wordTranslate));
  }
  return wordsList;
};
export const showTimer = (seconds: number): HTMLElement => {
  const timer = addTextElement('h2', 'timer', `${seconds}`) as HTMLElement;
  game.timerInterval = window.setInterval(async () => {
    if (seconds < 0) {
      timer.textContent = '';
      const timeIsUp = addTextElement('h2', 'time-is-up', 'Время вышло') as HTMLElement;
      timer.append(timeIsUp);
      await finishSprint();
    } else {
      timer.textContent = `${seconds}`;
      --seconds;
    }
  }, 1000);
  return timer;
};
export const updateScore = (scoreElement: HTMLElement) => {
  game.score += SCORE_ADDITION * game.scoreMultiplier;
  scoreElement.textContent = `${game.score}`;
};
export const updateSequence = async (
  correctAnswer: boolean,
  sequenceContainer: HTMLDivElement,
  levelElement: HTMLDivElement,
  scoreLevelElement: HTMLDivElement
) => {
  const sequenceCollection =
    sequenceContainer.getElementsByClassName('sprint-star') as HTMLCollectionOf<HTMLElement>;

  if (correctAnswer) {
    game.correctSequence++;
    game.maxCorrectSequence = Math.max(game.maxCorrectSequence, game.correctSequence);
    sequenceContainer.append(addElement('div', 'sprint-star'));
    if (game.correctSequence - (MULT_INC_TRIGGER_STEP * (game.scoreMultiplier - 1)) === MULT_INC_TRIGGER) {
      await audioPlay('LevelUp');
      [...sequenceCollection].forEach(star => {
        setTimeout(() => {
          star.classList.add('sprint-mult-increase');
        }, 200);
        setTimeout(() => {
          star.classList.remove('sprint-mult-increase');
        }, 500);
      });
      game.scoreMultiplier += 1;
      levelElement.textContent = `${game.scoreMultiplier}`;
      scoreLevelElement.textContent = `(+${game.scoreMultiplier * SCORE_ADDITION})`;
    }
  } else {
    if ([...sequenceCollection].length > 3) await audioPlay('LevelLost');
    else await audioPlay('WrongAnswer');
    game.maxCorrectSequence = Math.max(game.maxCorrectSequence, game.correctSequence);
    game.correctSequence = 0;
    game.scoreMultiplier = 1;
    levelElement.textContent = `${game.scoreMultiplier}`;
    scoreLevelElement.textContent = `(+${game.scoreMultiplier * SCORE_ADDITION})`;
    [...sequenceCollection].forEach((star, index) => {
      setTimeout(() => star.classList.add('sprint-mult-delete'), index * 10);
      setTimeout(() => star.remove(), 500);
    });
  }
};
export const formCurrentWordResult = (correct: boolean) => {
  game.userAnswers.push(correct);
  game.wordsListPlayed.push(game.wordsList[0]);
  if (game.userId) {
    const curIndex = game.wordsListPlayed.length - 1;
    game.isUserWord = !!game.wordsListPlayed[curIndex].userWord;
    const userWordPlayed = game.wordsListPlayed[curIndex].userWord || {};

    if (!userWordPlayed.optional) {
      userWordPlayed.optional = {
        addTime: Date.now(),
        new: true,
        games: {
          sprint: {
            right: 0,
            wrong: 0
          }
        }
      };
    }
    if (!userWordPlayed.optional.addTime) userWordPlayed.optional.addTime = Date.now();
    userWordPlayed.optional.new = Date.now() - userWordPlayed.optional.addTime <= DAY_24H;
    if (userWordPlayed.optional.new) game.newWordsCount++;
    const games = userWordPlayed.optional.games || {
      sprint: {
        right: 0,
        wrong: 0
      },
      correctAnswerSeries: 0
    };
    const sprint = games.sprint || {
      right: 0,
      wrong: 0
    };
    if (correct) sprint.right += 1;
    else sprint.wrong += 1;

    if (games.correctAnswerSeries) games.correctAnswerSeries = correct ? games.correctAnswerSeries + 1 : 0;
    else games.correctAnswerSeries = correct ? 1 : 0;

    switch (userWordPlayed.difficulty) {
      case 'learned':
        if (!correct) userWordPlayed.difficulty = 'hard';
        game.forgottenWordsCount++;
        break;
      case 'hard':
        if (games.correctAnswerSeries === HARD_SERIES) userWordPlayed.difficulty = 'learned';
        game.learnedWordsCount++;
        break;
      case 'easy':
        if (games.correctAnswerSeries === EASY_SERIES) userWordPlayed.difficulty = 'learned';
        game.learnedWordsCount++;
        break;
      default:
        userWordPlayed.difficulty = 'easy';
    }
    game.wordsListPlayed[curIndex].userWord = userWordPlayed;
  }
};
export const saveCurrentWordResult = async () => {
  const id = game.wordsListPlayed[game.wordsListPlayed.length - 1]._id as string;
  const word = game.wordsListPlayed[game.wordsListPlayed.length - 1].userWord as UserWord;
  if (game.isUserWord) await updateUserWord(game.userId, id, word);
  else await createUserWord(game.userId, id, word);
};
