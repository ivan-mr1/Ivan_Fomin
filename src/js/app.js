'use strict';

import { scrollUp } from './modules/scrollUp';
import Header from './modules/Header';
import headerFon from './modules/headerFon';
import spollers from './modules/spollers';
// import { DateUpdater } from './modules/DateUpdater';
// import { counterAnimation } from './modules/counterAnimation';

window.addEventListener('DOMContentLoaded', () => {
  scrollUp();
  new Header();
  headerFon();
  spollers();
  // new DateUpdater('.date', { useIntl: false, lang: 'ru' });
  // counterAnimation();
});
