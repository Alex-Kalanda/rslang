import { Word, WordExtended } from './interfaces';

export type StringsObject = {
  [key: string]: string[];
};

export type StringObject = {
  [key: string]: string | string[];
};

export type PaginationEvent = {
  page: number;
};

export type WordsList = Array<Word | WordExtended>;
