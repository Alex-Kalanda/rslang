import { SprintGameSettings } from '../../interfaces';
import { getUserId } from '../../utils/local-storage-helpers';

const gameInitial: SprintGameSettings = {
  userId: '',
  questionNumber: 0,
  score: 0,
  scoreMultiplier: 1,
  correctSequence: 0,
  maxCorrectSequence: 0,
  newWordsCount: 0,
  learnedWordsCount: 0,
  forgottenWordsCount: 0,
  rightOrWrong: false,
  group: '',
  page: '',
  isFromDictionary: false,
  wordsList: [],
  wordsListPlayed: [],
  isUserWord: false,
  answersList: [],
  question: '',
  rightAnswer: '',
  wrongAnswer: '',
  userAnswers: [],
  timerInterval: 0,
  isVolumeListened: false,
  isVolumeRangeListened: false,
  volume: 0.5,
  volumeMuted: false,
  isFinished: false,
};

export let game: SprintGameSettings = Object.assign({}, gameInitial);


export const initStore = (params?: URLSearchParams) => {
  game = Object.assign({}, gameInitial);
  game.wordsList = [];
  game.wordsListPlayed = [];
  game.answersList = [];
  game.userAnswers = [];
  game.userId = getUserId();
  game.group = params?.get('group') || '';
  game.page = params?.get('page') || '';
  const sprintVolume = localStorage.getItem('sprintVolume');
  if (sprintVolume && sprintVolume !== 'undefined') game.volume = Number(sprintVolume);
  else localStorage.setItem('sprintVolume', `${game.volume}`);
  game.volumeMuted = localStorage.getItem('sprintVolumeMuted') === 'true';
}
