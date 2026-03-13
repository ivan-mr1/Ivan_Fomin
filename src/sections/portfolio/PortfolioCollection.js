import Portfolio from './Portfolio.js';

export default class PortfolioCollection {
  constructor() {
    this.portfolios = [];
    this.init();
  }

  init() {
    document.querySelectorAll('[data-portfolio]').forEach((element) => {
      const portfolio = new Portfolio(element);
      this.portfolios.push(portfolio);
    });
  }

  setTabFilter(filter) {
    this.portfolios.forEach((portfolio) => {
      portfolio.setTabFilter(filter);
    });
  }

  setSearch(query) {
    this.portfolios.forEach((portfolio) => {
      portfolio.setSearch(query);
    });
  }
}
