import './AudioCall.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getWords } from '../../components/api/api';
import { getRandom } from '../../utils/get-random';
import { AudioCallListenerHandlers, Word, WordExtended } from '../../interfaces';
import playSound from './gameComponents/play-sound';
import getAnswers from './gameComponents/answers-list';
import { showModal } from '../../utils/show-modal';
import { AudioCallResult } from './gameComponents/AudioCall-result';
import { getEmptySlide, getSlide } from './gameComponents/game-slide';
import {
  getChapter,
  getGameLevel,
  getPage,
  getUserId,
  setChapter,
  setGameLevel,
  setPage,
} from '../../utils/local-storage-helpers';
import gameVars from './gameComponents/game-vars';
import { levelToGroup, shuffle } from '../../utils/micro-helpers';
import updateWord from './gameComponents/update-word';
import { audioPlay } from '../../components/sprint/sprint-sounds';
import { getObjectStatistic, setStatistic } from './gameComponents/game-statistic';

const handlers: AudioCallListenerHandlers = {};

const startAudioCall = async (callPlace?: string) => {
  //if call from textbook >>> we need attribute!
  await audioPlay('Start');
  const root = document.getElementById('root') as HTMLDivElement;
  const logInButton = document.querySelector('.navbar-auth') as HTMLButtonElement;
  if (callPlace === 'fromBook' && !getPage()) {
    setPage('0');
    setChapter('0');
  }

  const page: string = callPlace === 'fromBook' ? getPage() : String(getRandom(0, gameVars.AMOUNT_PAGES_OF_GROUP));
  const group: string = callPlace === 'fromBook' ? getChapter() : levelToGroup(getGameLevel());

  gameVars.statistic.length = 0;
  gameVars.wordsStatus.length = 0;
  let counter = 0;

  //create container for slides
  const gameContainer = addElement('main', 'audio-call-game') as HTMLElement;

  //request needed words(depending page and group)
  getWords(group, page).then((response: Array<WordExtended>) => {
    if (response.length) gameVars.AMOUNT_WORDS_IN_CHUNK = response.length;

    //get shuffled array targetArr(10)
    const tempArr: Array<WordExtended> = [...response];
    shuffle(tempArr);
    const targetArr: Array<WordExtended> = tempArr.slice(0, gameVars.AMOUNT_WORDS_IN_GAME);
    function delCompletedSlide() {
      //find and delete previous slide if it exists
      const completedSlide = document.querySelector('.audio-call-slide.completed') as HTMLElement;
      completedSlide?.remove();
    }

    function insertSlide(type?: string) {
      if (counter !== 10) {
        //create array with word have to use in answers
        const answers: Array<Word> = [...getAnswers(tempArr, counter)];

        //create slide >>> pass attr from our prepared arrays
        const slide = getSlide(targetArr[counter], answers, type === 'hide' ? 'hide' : '');
        const audio = slide.querySelector('.slide__audio-element') as HTMLAudioElement;
        const ansArea = slide.querySelector('.slide__answers') as HTMLDivElement;
        const soundBut = slide.querySelector('.audio-game-sound') as HTMLDivElement;

        soundBut.addEventListener('click', playSound.bind(null, audio));
        ansArea.addEventListener('click', handlers.checkMouseAns);
        gameContainer.appendChild(slide);
        if (counter === 0) {
          setTimeout(playSound.bind(null, audio), gameVars.AUDIO_DELAY);
        }
      } else {
        gameContainer.appendChild(getEmptySlide());
      }
    }
    const switchSlide = async () => {
      const currentSlide = document.querySelector('.audio-call-slide.done') as HTMLElement;
      const nextSlide = document.querySelector('.audio-call-slide.hide') as HTMLElement;
      const audio = nextSlide.querySelector('.slide__audio-element') as HTMLAudioElement;
      setTimeout(playSound.bind(null, audio), gameVars.AUDIO_DELAY);

      currentSlide?.classList.add('completed');
      nextSlide?.classList.remove('hide');
      if (counter !== 10) {
        await audioPlay('NextQuestion');
        document.addEventListener('keydown', handlers.checkKeyboardAns);
      }
      document.removeEventListener('keydown', switchSlide);
      document.removeEventListener('keydown', handlers.switchSlideFinal);
    };
    const checkAnsBasicLogic = async (target: HTMLElement) => {
      //clear unnecessary handler
      const currentSlide = document.querySelector('.audio-call-slide') as HTMLElement;
      const ansArea = currentSlide.querySelector('.slide__answers') as HTMLDivElement;
      ansArea.removeEventListener('click', handlers.checkMouseAns);
      document.removeEventListener('keydown', handlers.checkKeyboardAns);

      //adding next slide to game
      counter = counter + 1;
      insertSlide('hide');

      //logic to check right answer
      const currentAns: boolean = target.dataset.id === currentSlide.dataset.id;
      const rightAns = currentSlide.querySelector(`[data-id='${currentSlide.dataset.id}']`) as HTMLSpanElement;
      if (getUserId()) updateWord(targetArr[counter - 1], currentAns);

      //play sound
      if (currentAns) {
        await audioPlay('AnswerTrue');
      } else {
        await audioPlay('AnswerFalse');
      }

      gameVars.statistic.push(currentAns);
      if (currentAns) {
        target.classList.add('right');
      } else {
        target.classList.add('wrong');
        rightAns.classList.add('right');
      }

      //change view after answer
      currentSlide.classList.add('done');
      const nextBut = document.querySelector('.audio-game-button') as HTMLButtonElement;
      nextBut.disabled = false;
      if (counter === 10) {
        //update or set game statistic
        if (getUserId()) {
          const targetStat = await getObjectStatistic(gameVars.statistic, gameVars.wordsStatus);
          await setStatistic(targetStat);
        }

        nextBut.innerText = 'Результаты';
        nextBut.addEventListener('click', handlers.switchSlideFinal);
        document.addEventListener('keydown', handlers.switchSlideFinal);
      } else {
        nextBut.addEventListener('click', switchSlide);
        document.addEventListener('keydown', switchSlide);
      }
    };
    handlers.checkMouseAns = (event: MouseEvent): void => {
      delCompletedSlide();
      const target = event.target as HTMLElement;
      if (target.dataset.id) checkAnsBasicLogic(target);
    };
    handlers.checkKeyboardAns = (event: KeyboardEvent): void => {
      delCompletedSlide();
      if (gameVars.approved_KK.includes(event.keyCode)) {
        //check keyCode for separate pressing the main key from pressing the side keyboard
        const target =
          event.keyCode > 90
            ? (document.querySelector(`[data-num='${event.keyCode}']`) as HTMLElement)
            : (document.querySelector(`[data-key='${event.keyCode}']`) as HTMLElement);
        checkAnsBasicLogic(target);
      }
    };
    handlers.switchSlideFinal = async () => {
      await audioPlay('Finish');
      await switchSlide();
      await showModal(AudioCallResult(gameVars.statistic, targetArr), 'audiocall');
    };
    function switchOnLoginMode() {
      if (!getUserId()) {
        const hideSlide = document.querySelector('.audio-call-slide.hide') as HTMLElement;
        const slides = document.querySelectorAll('.audio-call-slide') as NodeListOf<HTMLElement>;
        const emptySlide = getEmptySlide() as HTMLElement;

        if (slides.length === 1) {
          gameContainer.appendChild(emptySlide);
          slides[0].classList.add('completed');
        } else {
          if (hideSlide) {
            slides[0].after(emptySlide);
          } else {
            slides[1].after(emptySlide);
            slides[1].classList.add('completed');
          }
        }
        switchSlide();
      }
      logInButton.removeEventListener('click', switchOnLoginMode);
      document.removeEventListener('keydown', handlers.checkKeyboardAns);
    }

    insertSlide();
    root.innerHTML = '';
    root.appendChild(gameContainer);
    document.addEventListener('keydown', handlers.checkKeyboardAns);
    logInButton.addEventListener('click', switchOnLoginMode); //remove listeners, when we logining
  });
};

function addListeners(element: HTMLElement, callPlace?: string) {
  const levelsArea = element.querySelector('#audio-call-level') as HTMLUListElement;
  const startButton = element.querySelector('#start-audio-call') as HTMLButtonElement;
  const levels = element.querySelectorAll('.difficulty__item') as NodeListOf<HTMLElement>;
  const activeLevel = getGameLevel();

  levels.forEach((item: HTMLElement) => {
    if (item.dataset.level === activeLevel) {
      item.classList.add('active');
    }
  });
  const chooseLevel = async (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    if (target.dataset.level) {
      await audioPlay('ChooseLevelClick');
      setGameLevel(target.dataset.level);
      levels.forEach((item: HTMLElement) => item.classList.remove('active'));
      target.classList.add('active');
      startButton.disabled = false;
    }
  };
  levelsArea?.addEventListener('click', chooseLevel);
  startButton.addEventListener('click', startAudioCall.bind(null, callPlace));
}

//запуск страницы с игрой
const AudioCall = (callPlace?: string): HTMLElement => {
  const page = addElement('main', 'audio-call-page') as HTMLElement;

  const levels: Array<string> = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const dataLevels: Array<string> = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

  const pageCaption = addTextElement('h2', 'audio-call-page__caption', 'АУДИОВЫЗОВ');
  const pageDesc = addElement('p', 'audio-call-page__desc');
  pageDesc.innerText = 'Игра "Аудиовызов" улучшит ваше восприятие на слух и понимание устной речи.';
  const levelsBlock = addElement('div', 'audio-call-page__difficulty difficulty');
  const levelsBlockDesc = addTextElement('p', 'difficulty__caption', 'Выберите сложность игры');
  const levelsList = addElement('ul', 'difficulty__list');
  levelsList.id = 'audio-call-level';
  levels.forEach((item, index) => {
    const elem = addTextElement('li', 'difficulty__item', levels[index]);
    elem.dataset.level = dataLevels[index];
    levelsList.appendChild(elem);
  });
  const startBut = addTextElement('button', 'start-audio-call', 'Начать') as HTMLButtonElement;
  startBut.id = 'start-audio-call';
  const warning = addTextElement(
    'div',
    'audio-call-page__warn',
    'Внимание! Чтобы сохранять прогресс обучения выполните вход в аккаунт.'
  );
  if (callPlace === 'fromBook') {
    startBut.disabled = false;
  } else {
    startBut.disabled = !getGameLevel();
  }
  if (!(callPlace === 'fromBook')) {
    levelsBlock.appendChild(levelsBlockDesc);
    levelsBlock.appendChild(levelsList);
  }
  levelsBlock.appendChild(startBut);
  page.appendChild(pageCaption);
  page.appendChild(pageDesc);
  page.appendChild(levelsBlock);
  if (!getUserId()) page.appendChild(warning);

  if (callPlace === 'fromBook') {
    addListeners(page, 'fromBook');
  } else {
    addListeners(page);
  }
  return page;
};

export { AudioCall, startAudioCall };
