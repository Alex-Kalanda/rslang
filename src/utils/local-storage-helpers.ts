import { Tokens } from '../interfaces';

export const setTokens = (tokens: Tokens): void => {
  localStorage.setItem('tokens', JSON.stringify(tokens));
};

export const getToken = (type?: string): string | null => {
  const tokens: Tokens = JSON.parse(<string>localStorage.getItem('tokens'));
  if (!tokens) return null;
  return type === 'refresh' ? tokens.refreshToken : tokens.token;
};

export const setUserId = (id: string): void => {
  localStorage.setItem('id', id);
};

export const getUserId = (): string => {
  return <string>localStorage.getItem('id');
};

export const setGameLevel = (level: string): void => {
  localStorage.setItem('gameLevel', level);
};
export const getGameLevel = (): string => {
  return <string>localStorage.getItem('gameLevel');
};

export const setUserName = (name: string): void => {
  localStorage.setItem('username', name);
};

export const getUserName = (): string => {
  return <string>localStorage.getItem('username');
};
export const setPage = (page: string): void => {
  localStorage.setItem('page', page);
};
export const setChapter = (chapter: string): void => {
  localStorage.setItem('chapter', chapter);
};
export const getPage = (): string => {
  return <string>localStorage.getItem('page');
};
export const getChapter = (): string => {
  return <string>localStorage.getItem('chapter');
};
