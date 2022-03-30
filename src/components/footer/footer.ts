import './footer.scss';
import { addElement } from '../../utils/add-element';
import rsicon from '../../assets/svg/rss.svg';

const Footer = () => {
  const footer = addElement('footer', 'footer', 'footer');
  const HTMLCode = `
    <div class="container">
      <div class="footer__authors-wrapper">
        <a class="footer__github" href="https://github.com/alex--sokolov" target="_blank">: Alexander Sokolov</a>
        <a class="footer__github" href="https://github.com/alex-kalanda" target="_blank">: Aliaksandr Kalanda</a>
        <a class="footer__github" href="https://github.com/petr9ra" target="_blank">: Petr Grachev</a>
      </div>
      <p class="footer__year">&#169; 2022</p>
      <a class="footer__rsschool" href="https://rs.school/js/" target="_blank">
        <img src=${rsicon} alt="RS School" />
      </a>
    </div>
  `;
  footer.insertAdjacentHTML('afterbegin', HTMLCode);
  return footer;
};

export default Footer;
