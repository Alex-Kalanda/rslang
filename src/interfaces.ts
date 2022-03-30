import { WordsList } from './types';

export interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
  _id: string;
}

export interface WordOptional {
  addTime?: number;
  new?: boolean;
  games?: GamesWordStat;
}

export interface UserWord {
  difficulty?: string;
  optional?: WordOptional;
}

export interface UserWordWithIds extends UserWord {
  id: string;
  wordId: string;
}

export interface WordExtended extends Word {
  userWord?: UserWord;
}

export interface aggregatedWordsResponse {
  wordsList: WordExtended[];
  totalWords: number;
}

export interface SignInParam {
  email: string;
  password: string;
}

export interface User {
  name: string;
  email: string;
}

export interface PostUser extends User {
  password: string;
}

export interface ResponseUser extends User {
  id: string;
}

export interface AuthParam {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface Tokens {
  token: string;
  refreshToken: string;
}

export interface FetchParam {
  method: string;
  withCredentials?: boolean;
  headers: {
    Authorization?: string;
    Accept?: string;
    'Content-Type'?: string;
  };
  body?: string;
}

export interface AudioCallVars {
  AMOUNT_PAGES_OF_GROUP: number;
  AMOUNT_WORDS_IN_GAME: number;
  AMOUNT_ANS_IN_GAME: number;
  AMOUNT_WORDS_IN_CHUNK: number;
  AUDIO_DELAY: number;
  statistic: Array<boolean>;
  wordsStatus: Array<string>;
  approved_KK: Array<number>;
  mainKeys: Array<number>;
  numKeys: Array<number>;
  diffTimeNewWord: number;
}

export interface SprintGameSettings {
  userId: string;
  questionNumber: number;
  score: number;
  scoreMultiplier: number;
  correctSequence: number;
  newWordsCount: number;
  learnedWordsCount: number;
  forgottenWordsCount: number;
  maxCorrectSequence: number;
  rightOrWrong: boolean;
  group: string;
  page: string;
  isFromDictionary: boolean;
  wordsList: WordsList;
  wordsListPlayed: WordExtended[];
  isUserWord: boolean;
  answersList: string[];
  question: string;
  rightAnswer: string;
  wrongAnswer: string;
  userAnswers: boolean[];
  timerInterval: number;
  music?: HTMLAudioElement;
  isVolumeListened: boolean;
  isVolumeRangeListened: boolean;
  volume: number;
  volumeMuted: boolean;
  isFinished: boolean;
  keyHandlerStart?: any;
  keyHandlerQuestions?: any;
}

export interface IWordsListResult {
  sound: string;
  word: string;
  translate: string;
}

export interface SprintGameResults {
  score: number;
  message: string;
  right: number;
  wrong: number;
  sequence: number;
  percent: number;
  wrongAnswers: IWordsListResult[];
  rightAnswers: IWordsListResult[];
}

export interface AudioCallListenerHandlers {
  checkMouseAns?: any;
  checkKeyboardAns?: any;
  switchSlideFinal?: any;
}

export interface Developer {
  firstName: string;
  lastName: string;
  imgRef: string;
  githubRef: string;
  position: string;
  responsibility: string[];
}

export interface TeamInfo {
  sokolov: Developer;
  kalanda: Developer;
  grachev: Developer;
}

export interface GamesWordStat {
  sprint?: GameWordStat;
  audioCall?: GameWordStat;
  correctAnswerSeries?: number;
}

export interface GameWordStat {
  right: number;
  wrong: number;
}

export interface GameWordStatExtended extends GameWordStat {
  newWordsCountPerDay: number;
  learnedWordsCountPerDay: number;
  forgottenWordsCountPerDay: number;
  maxCorrectSeriesPerDay: number;
}

export interface IStatisticsGames {
  sprint: GameWordStatExtended;
  audioCall: GameWordStatExtended;
}

export interface IStatisticsOptions {
  date: Date;
  newWords: number;
  games: IStatisticsGames;
  newWordsDictionary: number;
  learnedWordsDictionary: number;
}

export interface IStatistics {
  learnedWords: number;
  optional: {
    stat: {
      stat: IStatisticsOptions[];
    };
  };
}

export interface ILearnedHardPage {
  group: number;
  page: number;
  type?: string;
}

export interface ISettings {
  wordsPerDay?: number;
  optional?: {
    memory: {
      memory: ILearnedHardPage[];
    };
  };
}
