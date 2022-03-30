import './authorization.scss';
import { addElement, addTextElement } from '../../utils/add-element';
import { signIn } from './sign-in';
import { registration } from './registration';
import { signOut } from './sign-out';
import { getToken, getUserId, getUserName } from '../../utils/local-storage-helpers';
import { showModal } from '../../utils/show-modal';

const authSingInHTML = `
  <h3 class="auth__title">Вход</h3>
  <label for="email">Ваш email:</label>
  <input type="email" name="email" id="email" class="auth__input-field" placeholder="example@gmail.com">
  <label for="password">Пароль:</label>
  <input type="password" name="password" id="password" class="auth__input-field">
  <input type="submit" data-mode="signin" value="Войти">
  <p>Нет аккаунта? Тогда <button id="auth-toggle-btn" class="auth__toggle">зарегистрируйся!</button></p>
  <p id="auth__warn" class="auth__warn"></p>
`;
const authRegisterHTML = `
  <h3 class="auth__title">Регистрация</h3>
  <label for="email">Ваш email:</label>
  <input type="email" name="email" id="email" class="auth__input-field" placeholder="example@gmail.com">
  <label for="name">Ваше имя:</label>
  <input type="text" name="name" id="name" class="auth__input-field" placeholder="Anna">
  <label for="password">Придумайте пароль:</label>
  <input type="password" name="password" id="password" class="auth__input-field">
  <label for="password-2">Повторите пароль:</label>
  <input type="password" name="password-2" id="password-2" class="auth__input-field">
  <input type="submit" data-mode="register" value="Зарегистрироваться">
  <p>Уже есть аккаунт? <button id="auth-toggle-btn" class="auth__toggle">Войти!</button></p>
  <p id="auth__warn" class="auth__warn"></p>
`;

const Authorization = (type = 'signin') => {
  const element = addElement('form', 'auth-form auth') as HTMLFormElement;

  if (type === 'signin') {
    element.innerHTML = authSingInHTML;
  } else if (type === 'register') {
    element.innerHTML = authRegisterHTML;
  }
  return element;
};

const openAuthModal = async () => {
  if (!document.querySelector('.auth-form')) {
    await showModal(Authorization('signin'));
    const authForm = document.querySelector('.auth-form') as HTMLFormElement;
    authForm.setAttribute('data-type', 'signin');
  } else {
    const authForm = document.querySelector('.auth-form') as HTMLFormElement;
    const authFormType = authForm.getAttribute('data-type');

    if (authFormType === 'signin') {
      await showModal(Authorization('register'));
      document.querySelector('.auth-form')?.setAttribute('data-type', 'register');
    } else if (authFormType === 'register') {
      await showModal(Authorization('signin'));
      document.querySelector('.auth-form')?.setAttribute('data-type', 'signin');
    }
  }

  //обработчик нажатия "Войти"/"Зарегистрироваться"
  const submitForm = document.querySelector('.auth-form [type="submit"]') as HTMLInputElement;
  if (submitForm.dataset.mode === 'register') {
    submitForm.removeEventListener('click', signIn);
    submitForm.addEventListener('click', registration);
  }
  if (submitForm.dataset.mode === 'signin') {
    submitForm.removeEventListener('click', registration);
    submitForm.addEventListener('click', signIn);
  }

  //обработчик переключения режимов вход/регистрация
  const authToggleBtn = document.getElementById('auth-toggle-btn') as HTMLButtonElement;
  authToggleBtn.removeEventListener('click', signOut);
  authToggleBtn.addEventListener('click', openAuthModal);
};

const AuthPanel = (): HTMLElement => {
  const authPanel = addElement('div', 'auth-panel-container');
  const authUserName = addTextElement('span', 'navbar-name', getUserName());
  const authLinkText = getToken() ? 'Выйти' : 'Войти';
  const authLink = addTextElement('button', 'navbar-auth', authLinkText);
  authPanel.appendChild(authUserName);
  authPanel.appendChild(authLink);

  authLink.removeEventListener('click', getUserId() ? openAuthModal : signOut);
  authLink.addEventListener('click', getUserId() ? signOut : openAuthModal);
  return authPanel;
};

export { Authorization, openAuthModal, AuthPanel };
