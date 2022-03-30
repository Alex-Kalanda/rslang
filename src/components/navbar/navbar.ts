import './navbar.scss';
import { addElement } from '../../utils/add-element';
import { routes } from '../../engine/routes';
import setActiveLink from '../../utils/set-active-link';
import { getUserId } from '../../utils/local-storage-helpers';

const NavBar = () => {
  const nav = addElement('nav', 'navbar', 'navbar');

  for (const hash in routes) {
    if (hash === '404') continue;
    if (hash === 'statistics' && !(getUserId())) continue;
    const linkItem = addElement('a', 'navbar-item', `${hash}NavBtn`) as HTMLLinkElement;
    if (hash === '/') linkItem.classList.add('navbar-logo');
    linkItem.setAttribute('href', `#${hash}`);
    const linkName = document.createTextNode(routes[hash][1]);
    linkItem.appendChild(linkName);
    nav.appendChild(linkItem);
    linkItem.addEventListener('click', setActiveLink.bind('', hash));
  }

  return nav;
};

export { NavBar };
