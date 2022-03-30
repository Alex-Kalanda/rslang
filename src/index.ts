import './css/styles.scss';
import './components/preloader/preloader.scss';
import { navigate } from './engine/router-hash';
import Header from './components/header/header';
import Footer from './components/footer/footer';

const start = () => {
  const root = document.getElementById('root') as HTMLElement;
  root.before(Header());
  root.after(Footer());
  window.addEventListener('load', navigate);
  window.addEventListener('hashchange', navigate);
};

start();
