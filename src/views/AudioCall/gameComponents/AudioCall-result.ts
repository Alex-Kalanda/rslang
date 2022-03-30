import { addElement, addTextElement } from '../../../utils/add-element';
import { Word } from '../../../interfaces';
import { baseUrl } from '../../../components/api/api';
import sound from '../../../assets/img/sound.svg';
import './AudioCall-results.scss';
import playSound from './play-sound';

export const AudioCallResult = (results: Array<boolean>, words: Array<Word>): HTMLElement => {
  const resWrapper = addElement('div', 'result-wrapper');

  const resList = addElement('ul', 'results-box') as HTMLUListElement;
  const percent = (results.filter((res) => res).length / results.length) * 100;

  resList.innerHTML = `<div class="global" data-pie='{ "percent": ${percent} }'></div>`;
  results.forEach((res, index) => {
    const word: Word = words[index];
    const resItem = addElement('li', 'results-box__item');

    const imgSound = document.createElement('img') as HTMLImageElement;
    imgSound.src = sound;
    imgSound.alt = 'sound';
    const imgBox = addElement('div', 'results-box__item__img-box') as HTMLDivElement;
    imgBox.appendChild(imgSound);
    const resIcon = addTextElement('span', 'results-box__item__res', res ? '✔' : '❌') as HTMLSpanElement;
    const rightBox = addElement('div', 'results-box__item__right') as HTMLDivElement;
    rightBox.appendChild(imgBox);
    rightBox.appendChild(resIcon);
    const audio = document.createElement('audio') as HTMLAudioElement;
    audio.src = baseUrl + word.audio;
    const text = addTextElement('span', 'results-box__item__text', `${word.word} - ${word.wordTranslate}`);
    const itemPos = addTextElement('span', 'results-box__item__pos', `${index + 1}.`);
    imgSound.addEventListener('click', () => {
      playSound(audio);
    });
    resItem.appendChild(itemPos);
    resItem.appendChild(text);
    resItem.appendChild(audio);
    resItem.appendChild(rightBox);

    resList.appendChild(resItem);
  });
  resWrapper.appendChild(resList);

  setTimeout(() => {
    const globalConfig = {
      'lineargradient': ['yellow', '#ff0000'],
      'round': true,
      'colorCircle': '#e6e6e6',
      'speed': 24
    };
    const global = new CircularProgressBar('global', globalConfig);
    global.initial();
  }, 200);

  return resWrapper;
};
