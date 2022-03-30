interface DocumentWithFullscreen extends HTMLDocument {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}

export const isFullScreen = (): boolean => {
  const doc = document as DocumentWithFullscreen;
  return !!(doc.fullscreenElement ||
    doc.mozFullScreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement);
}

interface DocumentElementWithFullscreen extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}

export const requestFullScreen = (element: DocumentElementWithFullscreen) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen){
    element.mozRequestFullScreen();
  }
}

export const exitFullScreen = (doc: DocumentWithFullscreen) => {
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  } else if(doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  }
}

export const toggleFullScreen = (element: HTMLElement): void => {
  if (isFullScreen()) {
    exitFullScreen(document);
  }else {
    requestFullScreen(element);
  }
}
