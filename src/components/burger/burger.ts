import { addElement } from '../../utils/add-element';
import './burger.scss';

const Burger = () => {
  const burger = addElement('div', 'burger hide');

  Array(3)
    .fill('item')
    .forEach(() => {
      const line = addElement('span', 'burger__line');
      burger.appendChild(line);
    });
  burger.addEventListener('mouseover', () => {
    const nav = document.querySelector('.navbar') as HTMLElement;
    nav.classList.add('show');
  });
  burger.addEventListener('mouseout', () => {
    const nav = document.querySelector('.navbar') as HTMLElement;
    nav.classList.remove('show');
  });

  return burger;
};

export { Burger };
