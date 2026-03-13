'use strict';

import pageNavigation from '@components/page-navigation/pageNavigation';
import Header from '@layouts/header/Header';
import spollers from '@components/spollers/spollers';
import ScrollUpButton from '@components/scrollUpButton/ScrollUpButton';
import scroller from '@components/scroller/scroller';
import PortfolioCollection from '@sections/portfolio/PortfolioCollection';
import TabsCollection from '@components/tabs/Tabs';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  spollers();
  scroller();
  new Header();
  new ScrollUpButton();
  new PortfolioCollection();
  new TabsCollection();
});
