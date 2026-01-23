'use strict';

import pageNavigation from './modules/pageNavigation';
import headerFon from '@layouts/header/headerFon';
import Header from '@layouts/header/Header';
import spollers from '../components/spollers/spollers';
import ScrollUpButton from '../components/scrollUpButton/ScrollUpButton';
import scroller from '../components/scroller/scroller';
import Portfolio from '@sections/portfolio/Portfolio';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  headerFon();
  spollers();
  scroller();
  new Header();
  new ScrollUpButton();
  new Portfolio();
});
