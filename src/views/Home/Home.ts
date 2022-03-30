import './Home.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Home = (): HTMLElement => {
  const home = addElement('main', 'home-page container') as HTMLElement;
  const pageHeader = addElement('div', 'home-page__top-block') as HTMLDivElement;
  const pageTitle = addTextElement('h1', 'home-page__logo', 'RS Lang') as HTMLElement;

  const mainDescription = addTextElement(
    'p',
    'home-page__main-description',
    'Это приложение поможет вам освоить 3600 наиболее часто употребляемых слов английского языка.'
  );
  const featureTitle = addTextElement('p', 'home-page__feature-title', 'Содержание и особенности');

  const featureList = `
    <div class="home-page__feature-list">
      <a class="home-page__feature-item feature feature_1" href="/#dictionary">
        <h2 class="feature__title">Учебник</h2>
        <p class="feature__description">
          В нём вы можете просматировать все слова, слушать произношение, отмечать слова как сложные или изученные.
        </p>
      </a>
      <a class="home-page__feature-item feature feature_2" href="/#gameSprint">
        <h2 class="feature__title">Игра Спринт</h2>
        <p class="feature__description">
          Игра на время, где необходимо выбрать правильное слово из двух предложенных.
          Раунд длится 30 секунд, угадайте как можно больше слов за это время.
        </p>
      </a>
      <a class="home-page__feature-item feature feature_3" href="/#gameAudioCall">
        <h2 class="feature__title">Игра Аудиовызов</h2>
        <p class="feature__description">
          Эта игра улучшит ваше восприятие на слух.
          Каждый раунд содержит 10 слов и вам необходимо выбрать произнесённое слово из шести предложенных вариантов.
        </p>
      </a>
      <a class="home-page__feature-item feature feature_4" href="/#statistics">
        <h2 class="feature__title">Статистика</h2>
        <p class="feature__description">
          На странице статистики отображается прогресс обучения.
          Зарегистрируйтесь, чтобы ваш прогресс соханялся и вы могли отслеживать его.
        </p>
      </a>
    </div>
  `;

  pageHeader.append(pageTitle, mainDescription);

  home.append(pageHeader, featureTitle);
  home.insertAdjacentHTML('beforeend', featureList);
  return home;
};
