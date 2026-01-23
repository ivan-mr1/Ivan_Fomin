'use strict';
import pageNavigation from './modules/pageNavigation';
import Header from 'src/components/header/Header';
import ScrollUpButton from 'src/components/scrollUpButton/ScrollUpButton';
import scroller from 'src/components/scroller/scroller';
import shop from '@shop/shop';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  new Header();
  new ScrollUpButton();
  scroller();
  shop();
});
