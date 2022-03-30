import { Word } from '../interfaces';

export function levelToGroup(level: string): string {
  const convert: Record<string, string> = {
    a1: '0',
    a2: '1',
    b1: '2',
    b2: '3',
    c1: '4',
    c2: '5',
  };
  return convert[level];
}

export function shuffle(array: Array<Word>) {
  array.sort(() => Math.random() - 0.5);
}
