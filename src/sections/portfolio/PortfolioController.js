import PortfolioCollection from './PortfolioCollection.js';
import SelectCollection from '@components/form/select/Select.js';

const TAB_ID_TO_FILTER_KEY = {
  'tab-1': 'all',
  'tab-2': 'htmlcss',
  'tab-3': 'javascript',
  'tab-4': 'react',
  'tab-5': 'vue',
};

export default class PortfolioController {
  constructor() {
    this.portfolioCollection = new PortfolioCollection();
    this.selectCollection = new SelectCollection();
    this.searchInput = document.querySelector('[data-js-portfolio-search]');
    this.tabs = document.querySelector('[data-js-tabs]');

    this.initSearch();
    this.initTabs();
    this.initSelects();
  }

  initSearch() {
    if (!this.searchInput) {
      return;
    }

    this.searchInput.addEventListener('input', (e) => {
      this.portfolioCollection.setFilter(
        'search',
        e.target.value.trim().toLowerCase(),
      );
    });
  }

  initTabs() {
    if (!this.tabs) {
      return;
    }

    const buttons = this.tabs.querySelectorAll('[data-js-tabs-button]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterKey = TAB_ID_TO_FILTER_KEY[btn.id] ?? 'all';
        this.portfolioCollection.setFilter('tab', filterKey);
        this.setActiveTab(btn, buttons);
      });
    });
  }

  setActiveTab(activeBtn, buttons) {
    buttons.forEach((btn) => {
      const isActive = btn === activeBtn;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive);
      btn.tabIndex = isActive ? 0 : -1;
    });
  }

  initSelects() {
    this.selectCollection.selects.forEach((select) => {
      const filterKey = select.rootElement.dataset.jsPortfolioFilter;
      if (!filterKey) {
        return;
      }

      select.originalControlElement.addEventListener('change', (e) => {
        this.portfolioCollection.setFilter(filterKey, e.target.value);
      });
    });
  }
}
