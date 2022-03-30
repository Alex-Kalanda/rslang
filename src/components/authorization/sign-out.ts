import { openAuthModal } from './authorization';
import { navigate } from '../../engine/router-hash';

const signOut = async () => {
  const headerButton = document.querySelector('.navbar-auth') as HTMLFormElement;
  const headerName = document.querySelector('.navbar-name') as HTMLSpanElement;
  const headerStats = document.getElementById('statisticsNavBtn') as HTMLLinkElement;
  headerStats.remove();
  if (location.hash === '#statistics') {
    location.hash = '#';
  }
  localStorage.clear();

  headerButton.innerText = 'Войти';
  headerName.innerText = '';
  headerButton.removeEventListener('click', signOut);
  headerButton.addEventListener('click', openAuthModal);
  await navigate();
};

export { signOut };
