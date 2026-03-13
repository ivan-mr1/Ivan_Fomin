import Portfolio from './Portfolio.js';

export default class PortfolioCollection {
  constructor() {
    this.portfolios = [];
    this.init();
  }

  init() {
    document.querySelectorAll('[data-portfolio]').forEach((el) => {
      this.portfolios.push(new Portfolio(el));
    });
  }

  setFilter(key, value) {
    this.portfolios.forEach((portfolio) => portfolio.setFilter(key, value));
  }
}
