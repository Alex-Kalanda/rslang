import {
  aggregatedWordsResponse,
  ISettings,
  IStatistics,
  PostUser,
  SignInParam,
  Tokens,
  UserWord,
  UserWordWithIds,
  WordExtended,
} from '../../interfaces';
import { getToken, setTokens } from '../../utils/local-storage-helpers';
import { openAuthModal } from '../authorization/authorization';
import { hidePreloader, showPreloader } from '../preloader/preloader';

export const baseUrl = 'https://rs-lang-app-server.herokuapp.com/';

//TEXTBOOK

export const getWords = async (group: string, page: string): Promise<Array<WordExtended>> => {
  showPreloader();
  const response: Response = await fetch(`${baseUrl}words?group=${group}&page=${page}`);
  hidePreloader();
  return response.json();
};
export const getWordById = async (id: string): Promise<WordExtended> => {
  const response: Response = await fetch(`${baseUrl}words/${id}`);
  return response.json();
};

// USERS

//REGISTRATION NEW USER
export const createUser = async (user: PostUser): Promise<Response> => {
  return fetch(`${baseUrl}users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
};

//LOG IN - returns standard response for next status check
export const signInApi = async (form: SignInParam): Promise<Response> => {
  const param = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  };
  showPreloader();
  const response = await fetch(`${baseUrl}signin`, param);
  hidePreloader();
  return response;
};

//returns boolean value for check successfully updating
export const updateTokens = async (userId: string): Promise<boolean> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken('refresh')}`,
      Accept: 'application/json',
    },
  };
  const response = await fetch(`${baseUrl}users/${userId}/tokens`, param);
  if (response.ok) {
    response.json().then((resp: Tokens) => {
      setTokens(resp);
    });
  }
  return response.ok;
};

// if status===401 we need update tokens
export const getUserById = async (userId: string): Promise<Response> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  return fetch(`${baseUrl}users/${userId}`, param);
};

export const putUser = async (userId: string, form: SignInParam): Promise<Response> => {
  const param = {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: form.email, password: form.password }),
  };
  return fetch(`${baseUrl}users/${userId}`, param);
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  const param = {
    method: 'DELETE',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken('main')}`,
      Accept: '*/*',
    },
  };
  const response = await fetch(`${baseUrl}users/${userId}`, param);
  return response.ok;
};

/* ------------- USERS/WORDS -------------- */

export const getUserWords = async (userId: string): Promise<UserWordWithIds | void> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  let status401, result;
  showPreloader();
  const response: Response = await fetch(`${baseUrl}users/${userId}/words`, param);
  hidePreloader();
  switch (response.status) {
    case 200:
      return response.json();
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await getUserWords(userId);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    case 404:
      return undefined;
    default:
      throw new Error('Something went wrong');
  }
};

export const createUserWord = async (userId: string, wordId: string, word: UserWord): Promise<Response | void> => {
  const response: Response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  });
  let status401, result;
  switch (response.status) {
    case 200:
      return response;
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await createUserWord(userId, wordId, word);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    case 417:
      return response;
    default:
      throw new Error('Something went wrong');
  }
};

export const getUserWord = async (userId: string, wordId: string): Promise<UserWordWithIds | void> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
  let status401, result;
  switch (response.status) {
    case 200:
      return response.json();
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await getUserWord(userId, wordId);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    case 404:
      return undefined;
    default:
      throw new Error('Something went wrong');
  }
};

export const updateUserWord = async (userId: string, wordId: string, word: UserWord): Promise<Response | void> => {
  const param = {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(word),
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
  let status401, result;
  switch (response.status) {
    case 200:
      return response;
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await updateUserWord(userId, wordId, word);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    default:
      throw new Error('Something went wrong');
  }
};

export const deleteUserWord = async (userId: string, wordId: string): Promise<Response | void> => {
  const param = {
    method: 'DELETE',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken('main')}`,
      Accept: '*/*',
    },
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/words/${wordId}`, param);
  let status401, result;
  switch (response.status) {
    case 200:
      return response;
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await deleteUserWord(userId, wordId);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    default:
      throw new Error('Something went wrong');
  }
};

/* ------------- Users/AggregatedWords -------------- */
// Example for field filter:
// {"$and":[{"group":1}, {"page":25}, {"userWord.difficulty":"easy"}]}
// {"$or":[{"$and":[{"userWord.difficulty":"easy", "userWord.optional.new":true}]},{"userWord":null}]}
export const getUserAggregatedWords = async (
  userId: string,
  group?: string,
  page?: string,
  wordsPerPage?: string,
  filter?: string
): Promise<aggregatedWordsResponse | void> => {
  const params = [];
  if (group) params.push(`group=${group}`);
  if (page && !filter) params.push(`page=${page}`);
  if (wordsPerPage) params.push(`wordsPerPage=${wordsPerPage}`);
  if (filter) params.push(`filter=${filter}`);
  let filterQuery: string = params.join('&');
  filterQuery = filterQuery ? `?${filterQuery}` : '';
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  showPreloader();
  const response: Response = await fetch(`${baseUrl}users/${userId}/aggregatedWords${filterQuery}`, param);
  let status401, res, result;
  hidePreloader();
  switch (response.status) {
    case 200:
      res = await response.json();
      return { wordsList: res[0].paginatedResults, totalWords: res[0].totalCount[0] };
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await getUserAggregatedWords(userId, group, page, wordsPerPage, filter);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    default:
      throw new Error('Something went wrong');
  }
};

/* ------------- USERS/STATISTICS -------------- */

export const getUserStat = async (userId: string): Promise<IStatistics | void | undefined> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/statistics`, param);

  let status401, res, result;
  switch (response.status) {
    case 200:
      res = await response.json();
      return { learnedWords: res.learnedWords, optional: res.optional };
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await getUserStat(userId);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    case 404:
      return undefined;
    default:
      throw new Error('Something went wrong');
  }
};

export const putUserStat = async (userId: string, stat: IStatistics): Promise<string | void> => {
  const param = {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stat),
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/statistics`, param);

  let status401, result;
  switch (response.status) {
    case 200:
      return `Статистиска Вашей игры сохранена.`;
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await putUserStat(userId, stat);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    case 400:
      return 'К сожалению в настоящий момент Ваша статистика не может быть сохранена.';
    default:
      throw new Error('Something went wrong');
  }
};

/* ------------- USERS/SETTINGS -------------- */

export const getUserSettings = async (userId: string): Promise<ISettings | void> => {
  const param = {
    method: 'GET',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  };
  const response: Response = await fetch(`${baseUrl}users/${userId}/settings`, param);

  let status401, res, result;
  switch (response.status) {
    case 200:
      res = await response.json();
      return { wordsPerDay: res[0].wordsPerDay, optional: res[0].optional };
    case 401:
      status401 = await updateTokens(userId);
      if (status401) {
        result = await getUserSettings(userId);
        return result;
      } else {
        localStorage.clear();
        await openAuthModal();
      }
      break;
    default:
      throw new Error('Something went wrong');
  }
};

export const putUserSettings = async (userId: string, settings: ISettings): Promise<Response> => {
  const param = {
    method: 'PUT',
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  };
  return fetch(`${baseUrl}users/${userId}/settings`, param);
};
