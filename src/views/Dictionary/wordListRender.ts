import { addElement } from '../../utils/add-element';
import { WordExtended } from '../../interfaces';
import { wordCardRender } from './wordRender';
import { getChapter, getPage, getUserId } from '../../utils/local-storage-helpers';

const wordListRender = (words: WordExtended[]): HTMLDivElement => {
  const wordListContainer = addElement('div', 'word-list') as HTMLDivElement;
  const currentChapter = getChapter() || '0';

  let learnedCount = 0;
  let hardCount = 0;

  words.forEach((word, i) => {
    const wordButton = addElement('button', `word-item color-chapter-${currentChapter}`) as HTMLButtonElement;

    if (i === 0) {
      wordButton.classList.add('word-item_active');
    }

    wordButton.setAttribute('data-word-id', word.id ? word.id : word._id);
    const wordEng = document.createElement('h3') as HTMLHeadingElement;
    wordEng.textContent = word.word;
    const wordTranslate = document.createElement('p') as HTMLParagraphElement;
    wordTranslate.textContent = word.wordTranslate;

    if (word.userWord) {
      wordButton.classList.add(`word-item_${word.userWord.difficulty}`);
      if (word.userWord.difficulty === 'learned') learnedCount += 1;
      if (word.userWord.difficulty === 'hard') hardCount += 1;
    }

    wordButton.append(wordEng, wordTranslate);
    wordListContainer.append(wordButton);

    function setStateForList() {
      const audioCallLink = document.getElementById('audioCall-link') as HTMLLinkElement;
      const sprintLink = document.getElementById('sprint-link') as HTMLLinkElement;
      if (learnedCount === words.length || hardCount === words.length) {
        wordListContainer.classList.add(`word-list_${word.userWord?.difficulty}`);
        audioCallLink.classList.add('disabled');
        sprintLink.classList.add('disabled');
      } else {
        audioCallLink.classList.remove('disabled');
        sprintLink.classList.remove('disabled');
      }
    }

    setTimeout(setStateForList, 0);

    wordButton.addEventListener('click', () => {
      const activeWordBtn = wordListContainer.querySelector('.word-item_active') as HTMLButtonElement;
      activeWordBtn.classList.remove('word-item_active');
      wordButton.classList.add('word-item_active');

      const wordsContainerElement = document.querySelector('.dictionary-words-container') as HTMLDivElement;
      const wordCardElement = wordsContainerElement.firstElementChild as HTMLDivElement;
      wordCardElement.remove();
      wordsContainerElement.prepend(wordCardRender(word));
    });
  });

  return wordListContainer;
};

export default wordListRender;
