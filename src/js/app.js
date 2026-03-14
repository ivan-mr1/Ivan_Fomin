'use strict';

import pageNavigation from '@components/page-navigation/pageNavigation';
import Header from '@layouts/header/Header';
import SpollersCollection from '@components/spollers/spollers';
import ScrollUpButton from '@components/scrollUpButton/ScrollUpButton';
import scroller from '@components/scroller/scroller';
import TabsCollection from '@components/tabs/Tabs';
import PortfolioController from '@sections/portfolio/PortfolioController';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  new SpollersCollection();
  scroller();
  new Header();
  new ScrollUpButton();
  new TabsCollection();
  new PortfolioController();
});
