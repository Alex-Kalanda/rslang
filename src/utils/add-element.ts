export const addElement = (tagType: string, className: string, id?: string): HTMLElement => {
  const element = document.createElement(tagType);
  if(className != '') element.setAttribute('class', className);
  if(id) element.id = id;
  return element;
}

export const addTextElement = (tagType: string, className: string, text: string): HTMLElement => {
  const element = addElement(tagType, className);
  element.textContent = text;
  return element;
}

export const addLinkElement = (className: string, link:string, text?: string, id?: string): HTMLElement => {
  const element = addElement('a', className) as HTMLLinkElement;
  element.href = link;
  if (text) element.textContent = text;
  if (id) element.id = id;
  return element;
}

export const setDisabled = (el: HTMLButtonElement): void => {
  if (!el.disabled) el.setAttribute('disabled', 'true');
}

export const removeDisabled = (el: HTMLButtonElement): void => {
  if (el.disabled) el.removeAttribute('disabled');
}
