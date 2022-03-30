import { addElement, addTextElement } from '../../utils/add-element';
import { Word, WordExtended } from '../../interfaces';
import { getChapter, getUserId } from '../../utils/local-storage-helpers';
import voiceIco from '../../assets/svg/audio.svg';
import { lestenStateBtns } from './learnedAndDifficult';

let isAudioPlaying = false;

function playAudioTrigger(word: Word | WordExtended): void {
  const audioArr = [
    `https://rs-lang-app-server.herokuapp.com/${word.audio}`,
    `https://rs-lang-app-server.herokuapp.com/${word.audioMeaning}`,
    `https://rs-lang-app-server.herokuapp.com/${word.audioExample}`,
  ];

  if (isAudioPlaying) return;

  const playAudio = (num: number) => {
    let audioNum = num;
    const audio = new Audio();
    audio.src = audioArr[audioNum];
    audio.autoplay = true;
    audioNum += 1;
    isAudioPlaying = true;

    audio.addEventListener('loadedmetadata', () => {
      if (audioNum >= audioArr.length) {
        setTimeout(() => (isAudioPlaying = false), audio.duration * 1000 + 500);
        return;
      }
      setTimeout(() => playAudio(audioNum), audio.duration * 1000);
    });
  };

  playAudio(0);
}

async function setStatistics(word: WordExtended) {
  const sprintRightElement = document.getElementById('word-sprint-right-answer') as HTMLSpanElement;
  const sprintWrongElement = document.getElementById('word-sprint-wrong-answer') as HTMLSpanElement;
  const audioCallRightElement = document.getElementById('word-audiocall-right-answer') as HTMLSpanElement;
  const audioCallWrongElement = document.getElementById('word-audiocall-wrong-answer') as HTMLSpanElement;

  const sprintRightCount = word.userWord?.optional?.games?.sprint?.right;
  if (sprintRightCount) sprintRightElement.textContent = `${sprintRightCount}`;

  const sprintWrongCount = word.userWord?.optional?.games?.sprint?.wrong;
  if (sprintWrongCount) sprintWrongElement.textContent = `${sprintWrongCount}`;

  const audioCallRightCount = word.userWord?.optional?.games?.audioCall?.right;
  if (audioCallRightCount) audioCallRightElement.textContent = `${audioCallRightCount}`;

  const audioCallWrongCount = word.userWord?.optional?.games?.audioCall?.wrong;
  if (audioCallWrongCount) audioCallWrongElement.textContent = `${audioCallWrongCount}`;
}

export const wordCardRender = (word: WordExtended): HTMLDivElement => {
  const currentChapter = getChapter() || '0';
  const wordId: string = word.id || word._id;

  const wordCardContainer = addElement('div', `word-card card card_chapter-${currentChapter}`) as HTMLDivElement;
  const wordCardLeftSide = addElement('div', 'card__left-side') as HTMLDivElement;
  const wordCardRightSide = addElement('div', 'card__right-side') as HTMLDivElement;
  const btnsContainer = addElement('div', 'card__btns-container') as HTMLDivElement;

  const image = `<img src="https://rs-lang-app-server.herokuapp.com/${word.image}"
                  class="card__img" alt="Иллюстрация слова">`;
  const wordEng = addTextElement('strong', 'card__word', `${word.word} - `) as HTMLHeadingElement;
  const transcription = addTextElement('span', 'card__transcription', `${word.transcription} - `) as HTMLSpanElement;
  const translate = addTextElement('span', 'card__translate', `${word.wordTranslate}`) as HTMLParagraphElement;
  const subheading = addTextElement('h5', 'card__subheading', 'Значение') as HTMLHeadingElement;
  const textMeaning = addElement('p', 'card__text') as HTMLParagraphElement;
  textMeaning.insertAdjacentHTML('beforeend', word.textMeaning);
  const textMeaningTranslate = addTextElement(
    'p',
    'card__text',
    `${word.textMeaningTranslate}`
  ) as HTMLParagraphElement;
  const subheading2 = addTextElement('h5', 'card__subheading', 'Пример') as HTMLHeadingElement;
  const textExample = addElement('p', 'card__text') as HTMLParagraphElement;
  textExample.insertAdjacentHTML('beforeend', word.textExample);
  const textExampleTranslate = addTextElement(
    'p',
    'card__text',
    `${word.textExampleTranslate}`
  ) as HTMLParagraphElement;

  const statHeading = addTextElement('h5', 'card__subheading', 'Ответы в играх') as HTMLHeadingElement;
  const statData = `
    <table>
      <tr>
        <th>Спринт</th>
        <td class="card__right-answer" title="Правильных ответов">&#10004;:
          <span id="word-sprint-right-answer">0</span>
        </td>
        <td class="card__wrong-answer" title="Ошибок">&#10008;: <span id="word-sprint-wrong-answer">0</span></td>
      </tr>
      <tr>
        <th>Аудиовызов</th>
        <td class="card__right-answer" title="Правильных ответов">&#10004;:
          <span id="word-audiocall-right-answer">0</span>
        </td>
        <td class="card__wrong-answer" title="Ошибок">&#10008;: <span id="word-audiocall-wrong-answer">0</span></td>
      </tr>
    </table>
  `;

  const voiceBtn = addElement('button', `card__voice-btn color-chapter-${currentChapter}`) as HTMLButtonElement;
  const voiceIcon = addElement('img', 'card__voice-icon') as HTMLImageElement;
  voiceIcon.src = voiceIco;
  voiceBtn.append(voiceIcon);

  const hardBtn = addTextElement(
    'button',
    `card__btn card__btn_hard color-chapter-${currentChapter}`,
    'Сложное'
  ) as HTMLButtonElement;
  const learnedBtn = addTextElement(
    'button',
    `card__btn card__btn_learned color-chapter-${currentChapter}`,
    'Изученное'
  ) as HTMLButtonElement;

  wordCardRightSide.append(
    wordEng,
    transcription,
    translate,
    subheading,
    textMeaning,
    textMeaningTranslate,
    subheading2,
    textExample,
    textExampleTranslate
  );

  wordCardLeftSide.insertAdjacentHTML('afterbegin', image);
  btnsContainer.append(voiceBtn);
  if (getUserId()) {
    btnsContainer.append(hardBtn, learnedBtn);
    wordCardRightSide.append(statHeading);
    wordCardRightSide.insertAdjacentHTML('beforeend', statData);
  }

  wordCardRightSide.append(btnsContainer);
  wordCardContainer.append(wordCardLeftSide, wordCardRightSide);

  // Проверка состояния слова и присвоения класса для стилизации, если необходимо
  if (word.userWord) {
    wordCardContainer.classList.add(word.userWord.difficulty as string);
  }

  const wordAddedTime = word.userWord?.optional?.addTime;

  if (wordAddedTime) {
    const isWordNew = Date.now() - wordAddedTime < 24 * 60 * 60 * 1000;

    if (isWordNew) {
      const newMarkerContainer = addElement('div', 'card__new-marker') as HTMLDivElement;
      const newMarkerText = addTextElement('span', 'card__new-text', 'new') as HTMLSpanElement;

      wordCardContainer.classList.add('card_new');
      newMarkerContainer.append(newMarkerText);
      wordCardContainer.append(newMarkerContainer);
    }
  }

  voiceBtn.addEventListener('click', () => {
    playAudioTrigger(word);
  });

  hardBtn.addEventListener('click', (e) => lestenStateBtns(e, wordId, { difficulty: 'hard' }));
  learnedBtn.addEventListener('click', (e) => lestenStateBtns(e, wordId, { difficulty: 'learned' }));

  setTimeout(async () => {
    await setStatistics(word);
  }, 0);

  return wordCardContainer;
};
