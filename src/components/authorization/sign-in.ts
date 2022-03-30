import { AuthParam, SignInParam, Tokens } from '../../interfaces';
import { signInApi } from '../api/api';
import { setTokens, setUserId, setUserName } from '../../utils/local-storage-helpers';
import { signOut } from './sign-out';
import { openAuthModal } from './authorization';
import { showModal } from '../../utils/show-modal';
import { navigate } from '../../engine/router-hash';
import { addElement } from '../../utils/add-element';

function signIn(event: Event): void {
  event.preventDefault();
  const inputEmail = document.getElementById('email') as HTMLInputElement;
  const inputPassword = document.getElementById('password') as HTMLInputElement;
  const formValues: SignInParam = {
    email: inputEmail.value,
    password: inputPassword.value,
  };
  signInApi(formValues).then((response: Response) => {
    const status: number = response.status;
    const warn = document.getElementById('auth__warn') as HTMLParagraphElement;

    switch (status) {
      case 403:
        warn.classList.add('show');
        warn.innerText = 'Неверный пароль или email';
        break;
      case 404:
        warn.classList.add('show');
        warn.innerText = 'Пользователь не найден';
        break;
      case 200:
        warn.classList.remove('show');
        response.json().then(async (resp: AuthParam) => {
          const form = document.querySelector('.auth-form') as HTMLFormElement;
          const headerButton = document.querySelector('.navbar-auth') as HTMLFormElement;
          const headerName = document.querySelector('.navbar-name') as HTMLSpanElement;
          const tokens: Tokens = {
            token: resp.token,
            refreshToken: resp.refreshToken,
          };

          setTokens(tokens);
          setUserId(resp.userId);
          setUserName(resp.name);
          form.remove();
          headerButton.innerText = 'Выйти';
          headerName.innerText = resp.name;
          headerName.style.color = '';
          headerButton.removeEventListener('click', openAuthModal);
          headerButton.addEventListener('click', signOut);

          document.getElementById('modal-window')?.remove();
          document.querySelector('.overlay')?.classList.remove('overlay-fadeIn');

          const headerStats = addElement('a', 'navbar-item', 'statisticsNavBtn') as HTMLLinkElement;
          headerStats.setAttribute('href', '#statistics');
          headerStats.textContent = 'Статистика';
          const navBar = document.getElementById('navbar');
          navBar?.append(headerStats);

          if (location.hash === '#statistics') location.hash = '#';
          await navigate();
        });
        break;
      default:
        warn.classList.add('show');
        warn.innerText = 'Что-то пошло не так :(';
        break;
    }
  });
}

export { signIn };
