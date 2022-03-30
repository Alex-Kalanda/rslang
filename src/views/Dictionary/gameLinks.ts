import { addElement, addTextElement } from '../../utils/add-element';
import { getChapter, getPage } from '../../utils/local-storage-helpers';
import { AudioCall } from '../AudioCall/AudioCall';

export function renderGameLinks() {
  const currentChapter = getChapter() || '0';
  const currentPage = getPage() || '0';

  const container = addElement('div', 'game-links', 'game-links-container') as HTMLDivElement;
  const title = addTextElement('h2', 'game-links__title', 'Игры') as HTMLHeadingElement;
  const sectionDescription = addTextElement(
    'p',
    'game-links__description',
    'Проверьте насколько хорошо вы запомнили слова этого раздела.'
  );
  const gameLinksWrapper = addElement('div', 'game-links__list') as HTMLDivElement;

  const springGameContainer = addElement(
    'a',
    `game-item game-item_chapter-${currentChapter}`,
    'sprint-link'
  ) as HTMLLinkElement;
  springGameContainer.href = `#gameSprint?group=${currentChapter}&page=${currentPage}`;
  const springHeading = addTextElement('h3', 'game-item__title', 'Спринт') as HTMLHeadingElement;
  const sprintFeature = addTextElement(
    'p',
    `game-item__feature feature_color-chapter-${currentChapter}`,
    'Перевод на скорость'
  ) as HTMLParagraphElement;
  const sprintDescription = addTextElement(
    'p',
    'game-item__description',
    'Как можно быстрее определи верен ли предложенный перевод.'
  ) as HTMLParagraphElement;

  const audioCallGameContainer = addElement(
    'a',
    `game-item game-item_chapter-${currentChapter}`,
    'audioCall-link'
  ) as HTMLLinkElement;
  audioCallGameContainer.href = `#gameAudioCall`;
  const audioCallHeading = addTextElement('h3', 'game-item__title', 'Аудиовызов') as HTMLHeadingElement;
  const audioCallFeature = addTextElement(
    'p',
    `game-item__feature feature_color-chapter-${currentChapter}`,
    'Аудирование'
  ) as HTMLParagraphElement;
  const audioCallDescription = addTextElement(
    'p',
    'game-item__description',
    'Попробуй понять какое слово было произнесено и выбери его из предложенных.'
  ) as HTMLParagraphElement;

  springGameContainer.append(springHeading, sprintFeature, sprintDescription);
  audioCallGameContainer.append(audioCallHeading, audioCallFeature, audioCallDescription);

  gameLinksWrapper.append(springGameContainer, audioCallGameContainer);
  container.append(title, sectionDescription, gameLinksWrapper);

  audioCallGameContainer.addEventListener('click', () => {
    setTimeout(() => {
      const root = document.getElementById('root') as HTMLElement;
      root.innerHTML = '';
      root.appendChild(AudioCall('fromBook'));
    }, 0);
  });

  return container;
}
