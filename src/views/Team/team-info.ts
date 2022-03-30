import { TeamInfo } from '../../interfaces';
import dev1 from '../../assets/img/grachev.jpg';
import sokolov from '../../assets/img/sokolov.jpg';
import kalanda from '../../assets/img/kalanda.png';

const teamInfo: TeamInfo = {
  sokolov: {
    firstName: 'Александр',
    lastName: 'Соколов',
    imgRef: sokolov,
    githubRef: 'https://github.com/alex--sokolov',
    position: 'Team Leader',
    responsibility: ['Архитектура приложения, роутинг', 'Игра «Спринт»', 'Страница «Статистика»', 'Создание API'],
  },
  kalanda: {
    firstName: 'Александр',
    lastName: 'Каланда',
    imgRef: kalanda,
    githubRef: 'https://github.com/alex-kalanda',
    position: 'Developer',
    responsibility: [
      'Логика регистрации и авторизации',
      'Создание API',
      'Игра «Аудио вызов»',
      'Страница «Разработчики»',
    ],
  },
  grachev: {
    firstName: 'Пётр',
    lastName: 'Грачёв',
    imgRef: dev1,
    githubRef: 'https://github.com/petr9ra',
    position: 'Developer',
    responsibility: ['Дизайн приложения', 'Учебник и словарь', 'Главная страница приложения'],
  },
};

export default teamInfo;
