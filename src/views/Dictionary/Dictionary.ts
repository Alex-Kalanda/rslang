import './Dictionary.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { getUserId, getPage, getChapter, setPage, setChapter } from '../../utils/local-storage-helpers';
import { getWords, getUserAggregatedWords } from '../../components/api/api';
import { aggregatedWordsResponse, WordExtended } from '../../interfaces';
import { wordCardRender } from './wordRender';
import chapterRender from './chapterRender';
import wordListRender from './wordListRender';
import Pagination from 'tui-pagination';
import { PaginationEvent } from '../../types';
import './tui-pagination.scss';
import { renderGameLinks } from './gameLinks';

let wordsArr: WordExtended[] = [];
export let pagination: Pagination;
export let hardPageCount: number; // количество страниц для пагинации для раздела со сложными словами

const paginationOptions = {
  totalItems: 30,
  itemsPerPage: 1,
  visiblePages: 5,
  page: 1,
  centerAlign: true,
  firstItemClassName: 'tui-first-child',
  lastItemClassName: 'tui-last-child',
  template: {
    page: '<button class="tui-page-btn">{{page}}</button>',
    currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<button class="tui-page-btn tui-{{type}}">' + '<span class="tui-ico-{{type}}">{{type}}</span>' + '</button>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<button class="tui-page-btn tui-{{type}}-is-ellip">' + '<span class="tui-ico-ellip">...</span>' + '</button>',
  },
};

const getCurrPage = (): string => {
  if (getPage()) {
    paginationOptions.page = +getPage() + 1;
    return getPage();
  }
  return '0';
};

// ф-ия отмечает стилями выбранную главу
const markActiveChapter = () => {
  const currentChapter = getChapter() || '0';
  const targetRadioElement = document.getElementById(`chapter-${currentChapter}`) as HTMLInputElement;
  targetRadioElement.checked = true;
};

export const getWordsFunc = async (chapter: string, page: string) => {
  if (chapter === '6') {
    wordsArr = (
      (await getUserAggregatedWords(
        getUserId(),
        undefined,
        undefined,
        '3600',
        '{"userWord.difficulty": "hard"}'
      )) as aggregatedWordsResponse
    ).wordsList;

    hardPageCount = Math.ceil(wordsArr.length / 20);
    paginationOptions.totalItems = hardPageCount;

    if (wordsArr.length <= 20) return wordsArr;

    return (wordsArr = wordsArr.slice(+page * 20, +page * 20 + 20));
  } else if (getUserId()) {
    const aggregatedWords = (await getUserAggregatedWords(getUserId(), chapter, page, '20')) as aggregatedWordsResponse;

    return (wordsArr = aggregatedWords.wordsList);
  } else {
    return (wordsArr = await getWords(chapter, page));
  }
};

async function paginationListener(event: PaginationEvent) {
  const currentPage = event.page - 1;
  const currentChapter = getChapter() || '0';
  const wordsContainerElement = document.querySelector('.dictionary-words-container') as HTMLDivElement;
  const sprintLink = document.getElementById('sprint-link') as HTMLLinkElement;

  wordsArr = (await getWordsFunc(currentChapter, `${currentPage}`)) as WordExtended[];

  wordsContainerElement.innerHTML = '';
  wordsContainerElement.append(wordCardRender(wordsArr[0]), wordListRender(wordsArr));

  setPage(`${currentPage}`);
  if (!getChapter()) setChapter('0');

  sprintLink.href = `#gameSprint?group=${currentChapter}&page=${currentPage}`;
}

export const Dictionary = async (): Promise<HTMLElement> => {
  const page = addElement('main', 'dictionary-page container') as HTMLElement;
  const pageTitle = addTextElement('h1', 'page-title', 'Учебник') as HTMLHeadingElement;
  const wordsTitle = addTextElement('h2', 'words-title', 'Слова') as HTMLHeadingElement;
  const mainContentContainer = addElement('div', 'dictionary-words-container') as HTMLDivElement;
  const paginationElement = addElement('div', 'tui-pagination', 'pagination') as HTMLDivElement;

  page.append(pageTitle, chapterRender(), wordsTitle, mainContentContainer, paginationElement, renderGameLinks());

  const currentPage = getCurrPage();
  const currentChapter = getChapter() || '0';

  await getWordsFunc(currentChapter, currentPage);

  mainContentContainer.append(wordCardRender(wordsArr[0]));
  const wordList = wordListRender(wordsArr);
  mainContentContainer.append(wordList);

  if (currentPage === '0' && paginationOptions.page !== 1) {
    paginationOptions.page = 1;
  }
  
  pagination = new Pagination(paginationElement, paginationOptions);
  pagination.on('afterMove', async (event) => paginationListener(event));

  setTimeout(markActiveChapter, 0); // ф-ия отмечает стилем выбранную главу
  return page;
};
