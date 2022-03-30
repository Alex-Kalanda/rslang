import { StringObject } from '../../types';
import { getRandom } from '../../utils/calc';
import { game } from './sprint-store';
import { baseUrl } from '../api/api';

const sounds: StringObject = {
  Game: [
    'mp3/game1.mp3',
    'mp3/game2.mp3',
    'mp3/game3.mp3',
    'mp3/game4.mp3',
    'mp3/game5.mp3',
    'mp3/game6.mp3',
    'mp3/game7.mp3',
    'mp3/game8.mp3',
  ],
  Start: 'mp3/start.mp3',
  Start2: 'mp3/start2.mp3',
  ArrowLeft: 'mp3/menu-left.mp3',
  ArrowRight: 'mp3/menu-right.mp3',
  AnswerTrue: 'mp3/positive-notification.mp3',
  AnswerFalse: 'mp3/answer-false.mp3',
  NextQuestion: 'mp3/Whoosh-nex-slide.mp3',
  ChooseLevelClick: 'mp3/menu-mouse-choose.mp3',
  LevelUp: 'mp3/level-upgrade.mp3',
  LevelLost: 'mp3/sequence-null.mp3',
  CorrectAnswer: [
    'mp3/nice.mp3',
    'mp3/great.mp3',
    'mp3/good.mp3',
    'mp3/fantastic.mp3',
    'mp3/excellent.mp3',
    'mp3/superb.mp3',
    'mp3/yep-short.mp3',
  ],
  WrongAnswer: [
    'mp3/wrong1.mp3',
    'mp3/wrong2.mp3',
    'mp3/wrong3.mp3',
    'mp3/wrong4.mp3',
    'mp3/wrong5.mp3',
    'mp3/wrong6.mp3',
    'mp3/wrong7.mp3',
    'mp3/wrong8.mp3',
    'mp3/wrong9.mp3',
    'mp3/wrong10.mp3',
  ],
  Finish: ['mp3/finish1.mp3', 'mp3/finish2.mp3', 'mp3/finish3.mp3', 'mp3/finish4.mp3', 'mp3/finish5.mp3'],
};

export const audioPlay = async (sound: string): Promise<HTMLAudioElement> => {
  const audio = new Audio();
  const path = Array.isArray(sounds[sound]) ? sounds[sound][getRandom(sounds[sound].length)] : sounds[sound];
  audio.src = `assets/${path}`;
  audio.volume = game.volume;
  await audio.play();
  audio.muted = game.volumeMuted;
  return audio;
};

export const wordPlay = async (url: string): Promise<HTMLAudioElement> => {
  const audio = new Audio();
  audio.src = `${baseUrl + url}`;
  await audio.play();
  return audio;
};
