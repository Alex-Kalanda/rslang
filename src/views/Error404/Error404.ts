import './Error404.scss';
import { addElement, addTextElement } from '../../utils/add-element';

export const Error404 = (): HTMLElement => {
  const page = addElement('main', 'error-page') as HTMLElement;
  const pageTitle =  addTextElement('h1', 'page-title', 'Error 404') as HTMLElement;
  page.append(pageTitle);
  return page;
};
