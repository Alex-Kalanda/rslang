import { PostUser } from '../../interfaces';
import { createUser } from '../api/api';
import { navigate } from '../../engine/router-hash';

function registration(event: Event): void {
  event.preventDefault();
  const inputEmail = document.getElementById('email') as HTMLInputElement;
  const inputName = document.getElementById('name') as HTMLInputElement;
  const inputPassword = document.getElementById('password') as HTMLInputElement;
  const inputPassword2 = document.getElementById('password-2') as HTMLInputElement;
  const warn = document.getElementById('auth__warn') as HTMLParagraphElement;
  const headerName = document.querySelector('.auth-panel-container .navbar-name') as HTMLSpanElement;
  const formValues: PostUser = {
    email: inputEmail.value,
    name: inputName.value,
    password: inputPassword.value,
  };

  if (inputPassword.value === inputPassword2.value) {
    createUser(formValues).then((response: Response) => {
      const status: number = response.status;

      switch (status) {
        case 422:
          warn.classList.add('show');
          warn.innerText = 'Некорректный пароль или email';
          break;
        case 200:
          response.json().then(async (resp: PostUser) => {
            const form = document.querySelector('.auth-form') as HTMLFormElement;
            form.remove();
            headerName.innerText = 'Пользователь создан!';
            headerName.style.color = 'green';

            document.getElementById('modal-window')?.remove();
            document.querySelector('.overlay')?.classList.remove('overlay-fadeIn');
            await navigate();
          });
          break;
        default:
          warn.classList.add('show');
          warn.innerText = 'Что-то пошло не так :(';
          break;
      }
    });
  } else {
    warn.innerText = 'Пароли не одинаковые';
    warn.classList.add('show');
  }
}

export { registration };
