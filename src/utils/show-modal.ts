import './show-modal.scss';
import { addElement, addTextElement } from './add-element';
import { navigate } from '../engine/router-hash';

export const showModal = async (element: HTMLElement, behavior?: string): Promise<void> => {
  const overlay = document.querySelector('.overlay') as HTMLElement;
  const overlayFadeInClass = 'overlay-fadeIn';
  const modalClass = 'modal-window';
  const modalOld = document.getElementById(modalClass);
  const activeModalClass = 'modal-active';
  const closeModalClass = 'modal-close';
  const modal = addElement('div', modalClass, modalClass);
  modal.classList.add(activeModalClass);

  const removeModal = async (modalEl: HTMLElement, overlayListener?: void) => {
    modalEl.remove();
    if (overlay.classList.contains(overlayFadeInClass)) overlay.classList.remove(overlayFadeInClass);
    if (overlayListener) overlay.removeEventListener('click', overlayListener);
  };

  if (modalOld) await removeModal(modalOld);
  if (behavior !== 'sprint' && behavior !== 'audiocall') {
    const overlayListener = overlay.addEventListener(
      'click',
      async () => {
        await removeModal(modal, overlayListener);
      },
      { once: true }
    );
  }

  const root = document.getElementById('root') as HTMLDivElement;
  modal.append(element);

  if (behavior === 'sprint') {
    const sprintButtons = addElement('div', 'sprint-finish-buttons');
    const playAgain = addTextElement('button', closeModalClass, 'Сыграть еще');
    const toDictionary = addTextElement('button', closeModalClass, 'Перейти в словарь');

    playAgain.addEventListener(
      'click',
      async () => {
        await removeModal(modal);
        await navigate();
      },
      { once: true }
    );
    toDictionary.addEventListener(
      'click',
      async () => {
        await removeModal(modal);
        location.hash = '#dictionary';
      },
      { once: true }
    );
    sprintButtons.append(playAgain, toDictionary);
    modal.append(sprintButtons);
  } else {
    const closeModal = addTextElement('button', closeModalClass, 'Закрыть');
    closeModal.addEventListener(
      'click',
      async () => {
        await removeModal(modal);
        await navigate();
      },
      { once: true }
    );
    modal.append(closeModal);
  }
  overlay.classList.add(overlayFadeInClass);
  root.append(modal);
};
