import { routes } from './routes';
import setActiveLink from '../utils/set-active-link';
import { parseUrl } from '../utils/parse-url';
import Footer from '../components/footer/footer';

const router = async (route: string[] = routes['/'], params?: URLSearchParams): Promise<void> => {
  const currentView = await import(`../views/${route[0]}/${route[0]}`);
  const root = document.getElementById('root') as HTMLElement;
  const pageContent = await currentView[route[0]](params);
  if (pageContent) {
    root.innerText = '';
    root.append(pageContent);
  }
  if (location.hash.slice(1, 5) === 'game') document.getElementById('footer')?.remove();
  else if (!document.getElementById('footer')) root.after(Footer());
};

const navigate = async () => {
  const url = location.hash.slice(1) || '/';
  const urlParsed = parseUrl(url);
  let hash: string = urlParsed[0] || '/';
  if (!routes[hash]) hash = '404';
  setActiveLink(hash);
  if (urlParsed[1]) await router(routes[hash], urlParsed[1]);
  else await router(routes[hash]);
};

export { router, navigate };
