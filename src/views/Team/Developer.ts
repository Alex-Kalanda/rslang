import { addElement, addTextElement } from '../../utils/add-element';
import { Developer } from '../../interfaces';
import icon from '../../assets/svg/github-dark.svg';
import { toggleRaci } from './RACI';

export const Dev = ({ firstName, lastName, imgRef, githubRef, position, responsibility }: Developer): HTMLElement => {
  const dev = addElement('div', 'team__dev-item') as HTMLElement;
  const avatarContainer = addElement('div', 'dev-item__img-container') as HTMLDivElement;
  const avatar = addElement('img', 'dev-item__avatar') as HTMLImageElement;
  avatar.src = imgRef;
  avatar.loading = 'lazy';
  avatar.alt = 'avatar';
  avatarContainer.appendChild(avatar);
  avatar.addEventListener('dblclick', toggleRaci);
  const infoContainer = addElement('div', 'dev-item__info-container') as HTMLDivElement;
  const devName = addTextElement('div', 'dev-item__name', `${firstName} ${lastName}`) as HTMLDivElement;
  const githubName = githubRef.split('/').reverse()[0] as string;
  const github = addElement('a', 'dev-item__github') as HTMLLinkElement;
  github.href = githubRef;
  github.target = '_blank';
  const githubIcon = addElement('img', 'dev-item__github__icon') as HTMLImageElement;
  githubIcon.src = icon;
  githubIcon.alt = 'github Icon';
  const githubText = addTextElement('span', 'dev-item__github-text', githubName) as HTMLSpanElement;
  github.appendChild(githubIcon);
  github.appendChild(githubText);
  const role = addTextElement('div', 'dev-item__position', position) as HTMLDivElement;
  const workList = addElement('ul', 'dev-item__work') as HTMLUListElement;

  responsibility.forEach((item: string) => {
    const elem = addTextElement('li', 'dev-item__element', item) as HTMLLIElement;
    workList.appendChild(elem);
  });
  infoContainer.appendChild(devName);
  infoContainer.appendChild(github);
  infoContainer.appendChild(role);
  infoContainer.appendChild(workList);

  dev.appendChild(avatarContainer);
  dev.appendChild(infoContainer);
  return dev;
};
