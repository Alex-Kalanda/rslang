export const parseUrl = (url: string): [string, URLSearchParams?] => {
  const urlArr: [string, URLSearchParams?] = [''];
  const questionIndex: number = url.indexOf('?');
  if (questionIndex === -1) urlArr[0] = url;
  else {
    urlArr[0] = url.slice(0, questionIndex);
    const searchParams = new URLSearchParams(url.slice(questionIndex));
    urlArr.push(searchParams);
  }
  return urlArr;
};

export const clearLocationHashParams = (url:string) => {
  const urlArr = parseUrl(url);
  return urlArr[0];
}
