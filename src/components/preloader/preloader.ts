const getPreloader = (): HTMLElement => {
  return document.getElementById('holder') as HTMLDivElement;
};

export const addPreloader = (): void => {
  document.body.onload = () => {
    setTimeout(() => {
      const preloader = getPreloader();
      if (!preloader.classList.contains('hide')) {
        preloader.classList.add('hide');
      }
    }, 500);
  };
};

export const showPreloader = (): void => {
  const preloader = getPreloader();
  preloader?.classList.remove('hide');
};

export const hidePreloader = (): void => {
  const preloader = getPreloader();
  if (!preloader?.classList.contains('hide')) {
    preloader.classList.add('hide');
  }
};
