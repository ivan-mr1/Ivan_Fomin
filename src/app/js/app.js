'use strict';

import { pageNavigation } from '@/shared/lib';
import Header from '@/widgets/header/Header';
import SpollersCollection from '@/shared/ui/spollers/spollers';
import ScrollUpButton from '@/shared/ui/scrollUpButton/ScrollUpButton';
import scroller from '@/shared/ui/scroller/scroller';
import TabsCollection from '@/shared/ui/tabs/Tabs';
import Popup from '@/shared/ui/popup/popup';
import PortfolioController from '@/sections/portfolio/PortfolioController';
import productPopup from '@/sections/portfolio/product-popup/productPopup';

window.addEventListener('DOMContentLoaded', () => {
  pageNavigation();
  new Header();
  new SpollersCollection();
  scroller();
  new ScrollUpButton();
  new TabsCollection();
  new Popup();
  new PortfolioController();
  productPopup();
});
