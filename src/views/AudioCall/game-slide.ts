import { addElement } from '../../utils/add-element';
import { Word } from '../../interfaces';
import { baseUrl } from '../../components/api/api';
import soundIcon from '../../assets/img/sound.svg';

function getSlide(param: Word, ans: Array<Word>, type?: string): HTMLElement {
  const slide = addElement('div', 'audio-call-slide slide') as HTMLDivElement;
  slide.setAttribute('data-id', param.id);
  if (type) slide.classList.add('hide');

  slide.innerHTML = `
    <audio class="slide__audio-element" src=${baseUrl + param.audio}></audio>
    <div class="slide__question">
      <div class="slide__image">
        <img src=${baseUrl + param.image} alt="word image">
      </div>
      <div class="slide__sound">
        <span>${param.word}</span>
        <img src=${soundIcon} class="audio-game-sound" alt="play word">
      </div>
    </div>
    <div class="slide__answers">
      <div class="slide__answers-row">
        <span data-id=${ans[0].id} class="slide__answers__item">${ans[0].wordTranslate}</span>
        <span data-id=${ans[1].id} class="slide__answers__item">${ans[1].wordTranslate}</span>
        <span data-id=${ans[2].id} class="slide__answers__item">${ans[2].wordTranslate}</span>
      </div>
      <div class="slide__answers-row">
        <span data-id=${ans[3].id} class="slide__answers__item">${ans[3].wordTranslate}</span>
        <span data-id=${ans[4].id} class="slide__answers__item">${ans[4].wordTranslate}</span>
        <span data-id=${ans[5].id} class="slide__answers__item">${ans[5].wordTranslate}</span>
      </div>
    </div>
    <button disabled class="slide__button audio-game-button">Дальше</button>
  `;

  return slide;
}

function getEmptySlide(): HTMLElement {
  return addElement('div', 'audio-call-slide slide hide') as HTMLElement;
}

export { getSlide, getEmptySlide };
