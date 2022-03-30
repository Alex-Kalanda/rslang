import './header.scss';
import { addElement } from '../../utils/add-element';
import { NavBar } from '../navbar/navbar';
import { AuthPanel } from '../authorization/authorization';
import { Burger } from '../burger/burger';

const Header = () => {
  const element = addElement('header', 'header');
  const container = addElement('div', 'container') as HTMLDivElement;
  container.append(NavBar(), Burger(), AuthPanel());
  element.append(container);
  return element;
};

export default Header;
