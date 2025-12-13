'use strict';

import pageNavigation from './modules/pageNavigation';
import headerFon from '../components/header/headerFon';
import Header from './../components/header/Header';
import spollers from '../components/spollers/spollers';
import ScrollUpButton from '../components/scrollUpButton/ScrollUpButton';
import scroller from '../components/scroller/scroller';
import Portfolio from './portfolio/Portfolio';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  headerFon();
  spollers();
  scroller();
  new Header();
  new ScrollUpButton();
  new Portfolio();
});
