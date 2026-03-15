import Portfolio from './Portfolio.js';

export default class PortfolioCollection extends Portfolio {
  constructor() {
    super(document.createElement('div'));

    this.portfolios = [];
    this.init();
  }

  init() {
    document.querySelectorAll('[data-portfolio]').forEach((el) => {
      const portfolio = new Portfolio(el);
      portfolio.init();
      this.portfolios.push(portfolio);
    });
  }

  setFilter(key, value) {
    super.setFilter(key, value);
    this.portfolios.forEach((portfolio) => portfolio.setFilter(key, value));
  }
}
