import Portfolio from './Portfolio.js';

export default class PortfolioCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('[data-portfolio]').forEach((element) => {
      new Portfolio(element);
    });
  }
}
