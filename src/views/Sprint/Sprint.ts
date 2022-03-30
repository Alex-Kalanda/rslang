import './Sprint.scss';
import { addElement, addLinkElement, addTextElement, removeDisabled, setDisabled } from '../../utils/add-element';
import { getRandom } from '../../utils/calc';
import { shuffledArray } from '../../utils/modify-arrays';
import { game, initStore } from '../../components/sprint/sprint-store';
import { GAME_TIME, LEVELS, SCORE_ADDITION, TIMEOUT_BEFORE_START } from '../../components/sprint/sprint-vars';
import {
  addWordsForSprint,
  clearGame,
  formCurrentWordResult,
  getWrongAnswer,
  initWordsListDictionary,
  initWordsListMenu,
  saveCurrentWordResult,
  showTimer,
  updateScore,
  updateSequence,
} from '../../components/sprint/sprint';
import { audioPlay } from '../../components/sprint/sprint-sounds';
import { toggleFullScreen } from '../../utils/fullscreen';

export const Sprint = async (params?: URLSearchParams): Promise<HTMLElement | void> => {
  clearGame();
  initStore(params);
  const output = addElement('main', 'sprint-page', 'sprint-page') as HTMLElement;
  const pageTitle = addTextElement('h1', 'sprint-page-title', 'Sprint Page') as HTMLElement;
  const gameDescription = addElement('h2', 'sprint-description') as HTMLElement;
  gameDescription.insertAdjacentHTML(
    'afterbegin',
    'Спринт - игра на скорость.<br> Цель - угадать как можно больше слов за 30 секунд.'
  );
  const gameLevelAnnotation =
    game.group && game.page
      ? addTextElement('p', 'sprint-level-notes', 'Игра начнется с текущими словами из словаря')
      : addTextElement('p', 'sprint-level-notes', 'Выберите уровень');
  const button = addTextElement('button', 'sprint-start-button', 'Начать') as HTMLButtonElement;
  const showHints = (hint: string): HTMLDivElement => {
    const result = addElement('div', '') as HTMLDivElement;
    if (hint === 'arrows_main') {
      const TOTAL_ARROWS = 3;
      result.classList.add('arrows-hint');
      const arrowsLeft = addElement('div', 'arrows-left') as HTMLDivElement;
      const arrowsRight = addElement('div', 'arrows-right') as HTMLDivElement;
      for (let i = 0; i < TOTAL_ARROWS; i++) {
        const arrowLeft = addElement('span', 'arrow-left');
        const arrowRight = addElement('span', 'arrow-right');
        arrowsLeft.append(arrowLeft);
        arrowsRight.append(arrowRight);
      }
      const arrowsLeftContainer = addElement('div', 'arrows-left-container');
      const arrowLeftHint = addTextElement('div', 'arrow-left-hint', '[ ArrowLeft ]');
      arrowsLeftContainer.append(arrowsLeft, arrowLeftHint);
      const arrowsRightContainer = addElement('div', 'arrows-right-container');
      const arrowRightHint = addTextElement('div', 'arrow-right-hint', '[ ArrowRight ]');
      arrowsRightContainer.append(arrowsRight, arrowRightHint);
      result.append(arrowsLeftContainer, arrowsRightContainer);
      return result;
    } else if (hint === 'enter_main') {
      result.classList.add('enter-hint');
      result.textContent = '[ Enter ]';
      return result;
    }
    return result;
  };
  output.append(pageTitle, gameDescription, gameLevelAnnotation);

  if (game.group && game.page) await initWordsListDictionary();
  else {
    const levelWrapper = addElement('div', 'sprint-levels', 'sprint-levels');
    const createLevels = (level: string, index: number) => {
      const levelEl = addTextElement('button', 'sprint-level', level) as HTMLButtonElement;
      const chooseLevelHandler = async () => {
        await audioPlay('ChooseLevelClick');
        const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
        [...levelBtns].forEach((btn) => {
          if (btn.classList.contains('active')) btn.classList.remove('active');
          setDisabled(btn);
        });
        if (!levelEl.classList.contains('active')) levelEl.classList.add('active');
        await initWordsListMenu(index);
        [...levelBtns].forEach((btn) => removeDisabled(btn));
        removeDisabled(button);
      };

      levelEl.addEventListener('click', chooseLevelHandler);
      levelWrapper.append(levelEl);
    };
    LEVELS.forEach(createLevels);

    const clearKeyHandlerStart = () => {
      document.removeEventListener('keyup', game.keyHandlerStart);
      window.removeEventListener('hashchange', clearKeyHandlerStart);
    };
    window.addEventListener('hashchange', clearKeyHandlerStart);

    output.append(levelWrapper, showHints('arrows_main'));
    setDisabled(button);
  }
  const showQuestion = async (): Promise<void> => {
    game.music = await audioPlay('Game');
    const scoreContainer = addElement('div', 'sprint-score-container');
    const scoreField = addTextElement('div', 'sprint-score-text', 'Ваш Score — ');
    const scoreEl = addTextElement('div', 'sprint-score', `${game.score}`);
    const sequenceContainer = addElement('div', 'sprint-sequence-container') as HTMLDivElement;
    const levelContainer = addElement('div', 'sprint-levelInGame-container') as HTMLDivElement;
    const levelField = addTextElement('div', 'sprint-levelInGame-text', 'Level -') as HTMLDivElement;
    const levelEl = addTextElement('div', 'sprint-levelInGame', `${game.scoreMultiplier}`) as HTMLDivElement;
    const scoreLevelEl = addTextElement(
      'div',
      'sprint-score-level',
      `(+${game.scoreMultiplier * SCORE_ADDITION})`
    ) as HTMLDivElement;
    const questionContainer = addElement('div', 'sprint-question-container') as HTMLElement;
    const btnsAnswersContainer = addElement('div', 'btns-answers-container') as HTMLElement;
    const btnYes = addTextElement('button', 'btn-yes', 'Верно') as HTMLButtonElement;
    const btnNo = addTextElement('button', 'btn-no', 'Неверно') as HTMLButtonElement;
    const clearKeyHandler = () => {
      document.removeEventListener('keyup', game.keyHandlerQuestions);
      window.removeEventListener('hashchange', clearKeyHandler);
    };
    const changeQuestion = () => {
      game.question = game.wordsList[0].word;
      game.rightAnswer = game.wordsList[0].wordTranslate;
      game.wrongAnswer = getWrongAnswer(game.rightAnswer, game.answersList);
      const questionEl = addTextElement('div', 'sprint-question', `${game.question}`) as HTMLElement;
      const equality = addTextElement('div', 'sprint-question-equality', ` это `) as HTMLElement;
      const answerEl = addElement('div', 'sprint-question-answer') as HTMLElement;
      const questionMark = addTextElement('div', 'sprint-question-mark', '?') as HTMLElement;
      game.rightOrWrong = Boolean(getRandom(2));
      answerEl.textContent = game.rightOrWrong ? game.rightAnswer : game.wrongAnswer;
      questionContainer.append(questionEl, equality, answerEl, questionMark);
      setTimeout(() => {
        if (!game.isFinished) {
          document.addEventListener('keyup', game.keyHandlerQuestions);
          window.addEventListener('hashchange', clearKeyHandler);
        }
      }, 500);
    };

    const nextQuestion = async (userAnswer: boolean): Promise<void> => {
      clearKeyHandler();
      setDisabled(btnNo);
      setDisabled(btnYes);
      questionContainer.innerHTML = '';
      const correct = userAnswer === game.rightOrWrong;
      if (!correct) {
        await updateSequence(false, sequenceContainer, levelEl, scoreLevelEl);
      } else {
        await audioPlay('CorrectAnswer');
        updateScore(scoreEl);
        await updateSequence(true, sequenceContainer, levelEl, scoreLevelEl);
      }
      formCurrentWordResult(correct);
      if (game.userId) await saveCurrentWordResult();
      if (game.wordsList.length === 1) game.wordsList = await addWordsForSprint();
      else game.wordsList.shift();
      if (game.wordsList.length > 0 && !game.isFinished) {
        changeQuestion();
        removeDisabled(btnNo);
        removeDisabled(btnYes);
      }
    };
    game.keyHandlerQuestions = (e: KeyboardEvent) => {
      if (game.isFinished) removeEventListener('keyup', game.keyHandlerQuestions);
      else {
        if (e.key === 'ArrowLeft') nextQuestion(false);
        if (e.key === 'ArrowRight') nextQuestion(true);
      }
    };
    scoreContainer.append(scoreField, scoreEl);
    levelContainer.append(levelField, levelEl, scoreLevelEl);
    changeQuestion();
    btnNo.addEventListener('click', nextQuestion.bind(null, false));
    btnYes.addEventListener('click', nextQuestion.bind(null, true));
    btnsAnswersContainer.append(btnNo, btnYes);
    pageTitle.remove();
    gameDescription.remove();
    gameLevelAnnotation.remove();
    const levelWrapper = document.getElementById('sprint-levels');
    if (levelWrapper) levelWrapper.remove();
    button.remove();
    output.append(
      showTimer(GAME_TIME),
      scoreContainer,
      sequenceContainer,
      levelContainer,
      questionContainer,
      btnsAnswersContainer
    );
  };
  const startSprint = async (): Promise<void> => {
    document.removeEventListener('keyup', game.keyHandlerStart);
    pageTitle.classList.add('out-left');
    gameDescription.classList.add('out-right');
    gameLevelAnnotation.classList.add('out-left');
    button.classList.add('out-down');
    document.querySelector('.arrows-left-container')?.classList.add('out-direct-left');
    document.querySelector('.arrows-right-container')?.classList.add('out-direct-right');
    document.querySelector('.enter-hint')?.classList.add('out-direct-bottom');
    const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
    if (levelBtns) {
      [...levelBtns].forEach((level, index) => {
        if (level.classList.contains('active')) level.classList.add(`out-active`);
        else level.classList.add(`out-level-${index % 2}`);
      });
    }
    if (game.wordsList.length === 0) game.wordsList = await addWordsForSprint();
    else {
      shuffledArray(game.wordsList);
      game.wordsList.forEach((word) => game.answersList.push(word.wordTranslate));
    }
    setTimeout(async () => {
      await audioPlay('Start2');
      await showQuestion();
    }, TIMEOUT_BEFORE_START);
  };
  const settingsMenu = (): HTMLDivElement => {
    const settingsContainer = addElement('div', 'settings') as HTMLDivElement;
    const closeGame = addLinkElement('sprint-home-link', '/') as HTMLLinkElement;
    const fullScreenMode = addElement('div', 'sprint-fullscreen') as HTMLDivElement;
    fullScreenMode.addEventListener('click', () => {
      toggleFullScreen(output);
      fullScreenMode.classList.toggle('fullscreen-exit');
    });
    const volumeContainer = addElement('div', 'progress-volume-bar') as HTMLDivElement;
    const volume = addElement('div', 'volume') as HTMLDivElement;
    const volumeRange = addElement('input', 'progress-volume') as HTMLInputElement;
    const gameVolume = game.volume * 100;
    volumeRange.setAttribute('type', 'range');
    if (game.volumeMuted) {
      volumeRange.value = '1';
      volumeRange.style.background = '#fff';
      volume.classList.add('mute');
    } else {
      volumeRange.style.background = `linear-gradient(to right, goldenrod 0%, goldenrod ${gameVolume}%,
    #fff ${gameVolume}%, white 100%)`;
      volumeRange.setAttribute('value', `${gameVolume}`);
    }
    volumeRange.setAttribute('min', '0');
    volumeRange.setAttribute('max', '100');
    volumeRange.setAttribute('step', '1');
    volumeContainer.append(volume, volumeRange);
    settingsContainer.append(closeGame, volumeContainer, fullScreenMode);
    if (!game.isVolumeRangeListened) {
      volumeRange.addEventListener('input', function (e) {
        const value = this.value;
        if (+value <= 1) {
          if (game.music) game.music.muted = true;
          localStorage.setItem('sprintVolumeMuted', 'true');
          game.volumeMuted = true;
          volume.classList.add('mute');
        } else {
          if (game.music) game.music.muted = false;
          volume.classList.remove('mute');
          localStorage.setItem('sprintVolumeMuted', 'false');
          game.volumeMuted = false;
        }
        if (game.music) game.music.volume = +value / 100;
        this.style.background = `linear-gradient(to right, goldenrod 0%,
    goldenrod ${value}%, #fff ${value}%, white 100%)`;
        localStorage.setItem('sprintVolume', JSON.stringify(game.music?.volume));
        game.volume = +value / 100;
      });
      game.isVolumeRangeListened = true;
    }
    const muteUnmute = () => {
      game.volumeMuted = !game.volumeMuted;
      localStorage.setItem('sprintVolumeMuted', `${game.volumeMuted}`);
      if (game.music) game.music.muted = !game.music?.muted;
      if (game.volumeMuted) {
        volumeRange.value = '1';
        volumeRange.style.background = '#fff';
        volume.classList.add('mute');
      } else {
        volumeRange.value = `${game.volume * 100}`;
        volumeRange.style.background = `linear-gradient(to right, goldenrod 0%,
    goldenrod ${volumeRange.value}%, #fff ${volumeRange.value}%, white 100%)`;
        volume.classList.remove('mute');
      }
    };
    if (!game.isVolumeListened) {
      volume.addEventListener('click', muteUnmute);
      game.isVolumeListened = true;
    }
    return settingsContainer;
  };
  button.addEventListener('click', async () => {
    await audioPlay('Start');
    await startSprint();
  });
  game.keyHandlerStart = async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !button.disabled) {
      document.removeEventListener('keyup', game.keyHandlerStart);
      await audioPlay('Start');
      await startSprint();
    }
    if (!params && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      document.removeEventListener('keyup', game.keyHandlerStart);
      await audioPlay(e.key);
      const levelBtns = document.getElementsByClassName('sprint-level') as HTMLCollectionOf<HTMLButtonElement>;
      let indexActive = -1;
      const indexLast = levelBtns.length - 1;
      [...levelBtns].forEach((btn, index) => {
        if (btn.classList.contains('active')) {
          indexActive = index;
          btn.classList.remove('active');
        }
      });
      if (indexActive === -1) indexActive = e.key === 'ArrowLeft' ? 0 : indexLast;
      else {
        levelBtns[indexActive].classList.remove('active');
        indexActive += e.key === 'ArrowLeft' ? -1 : 1;
        if (indexActive === -1) indexActive = indexLast;
        if (indexActive === indexLast + 1) indexActive = 0;
      }
      await initWordsListMenu(indexActive);
      levelBtns[indexActive].classList.add('active');
      if (button.disabled) removeDisabled(button);
      document.addEventListener('keyup', game.keyHandlerStart);
    }
  };
  document.addEventListener('keyup', game.keyHandlerStart);
  output.append(button, showHints('enter_main'));
  output.append(settingsMenu());
  window.addEventListener('hashchange', clearGame);
  return output;
};
