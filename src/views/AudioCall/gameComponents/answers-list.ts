import { Word } from '../../../interfaces';
import gameVars from './game-vars';
import { getRandom } from '../../../utils/get-random';
import { shuffle } from '../../../utils/micro-helpers';

function getAnswers(arr: Array<Word>, counter: number): Array<Word> {
  const posArr: Array<number> = [counter];
  while (posArr.length < gameVars.AMOUNT_ANS_IN_GAME) {
    const newNum: number = getRandom(0, gameVars.AMOUNT_WORDS_IN_CHUNK - 1);
    if (!posArr.includes(newNum)) posArr.push(newNum);
  }
  const output = posArr.map((pos: number): Word => arr[pos]);
  shuffle(output);
  return output;
}

export default getAnswers;
