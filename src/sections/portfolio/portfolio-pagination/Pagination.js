const STATES = {
  ACTIVE: 'is-active',
  HIDDEN: 'is-hidden',
  IN_CART: 'is-in-cart',
};

const I18N = {
  CURRENCY: 'грн',
  ARTICLE: 'Артикул:',
  BUY: 'Купити',
  IN_CART: 'В кошику',
  ADD_TO_FAVORITES: 'Додати до обраного',
  REMOVE_FROM_FAVORITES: 'Видалити з обраного',
  ADD_TO_CART_ARIA: 'Додати у кошик товар',
  IN_CART_ARIA: 'Товар уже у кошику',
  PRODUCT_LINK_ARIA: 'Перейти до опису моделі',
  PRODUCT_NOT_FOUND: 'Товар не знайдено',
  PRODUCTS_NOT_FOUND: 'Товари не знайдено',
  EMPTY_CART: 'Ваш кошик порожній',
  DELETE_ITEM: 'Видалити товар',
  INCREASE_QUANTITY: 'Збільшити кількість',
  DECREASE_QUANTITY: 'Зменшити кількість',
  PREV_PAGE: 'Попередня сторінка',
  NEXT_PAGE: 'Наступна сторінка',
  PAGE: 'Сторінка',
  CURRENT_PAGE: 'Поточна сторінка',
  PAGINATION_LABEL: 'Пагінація товарів',
  EMPTY_LIST: 'Ваш список порожній',
  ART_SHORT: 'Art:',
  TITLE_REMOVE: 'Видалити',
  TITLE_BUY: 'В кошик',
  ARIA_REMOVE_FROM_LIST: 'Видалити товар зі списку обраного',
  ARIA_ADD_TO_CART: 'Додати товар у кошик',
  ARIA_PRODUCT_LINK: 'Перейти к товару',
  PRICE_LABEL: 'Ціна',
};

const ATTRIBUTES = {
  PRODUCT_ID: 'data-product-id',
  PRODUCT_CARD: {
    ROOT: 'data-product',
    PRICE: 'data-card-price',
    BUY_BTN: 'data-card-buy-btn',
    FAVORITE_BTN: 'data-card-favorite',
  },
  PRODUCT_DETAILS: {
    BUY_BTN: 'data-details-buy',
    FAVORITE_BTN: 'data-details-favorite',
    BREADCRUMB: 'data-product-breadcrumb',
  },
  CART: {
    MINUS: 'data-cart-minus',
    PLUS: 'data-cart-plus',
    REMOVE: 'data-cart-remove-btn',
  },
  FAVORITE: {
    REMOVE: 'data-favorite-remove-btn',
    BUY: 'data-favorite-buy-btn',
    DROPDOWN: {
      ROOT: '[data-favorite]',
      BUTTON: '[data-favorite-btn]',
    },
  },
  PAGINATION: {
    ROOT: '[data-pagination]',
    LIST: '[data-pagination-list]',
    PREV: '[data-pagination-btn-prev]',
    NEXT: '[data-pagination-btn-next]',
  },
};

/**
 * > 768px: (visibleRange: 2)
 * 370px - 768px: (visibleRange: 1)
 * < 370px: (visibleRange: 0)
 */
export default class Pagination {
  defaultSelectors = {
    pagination: ATTRIBUTES.PAGINATION.ROOT,
    paginationList: ATTRIBUTES.PAGINATION.LIST,
    btnPrev: ATTRIBUTES.PAGINATION.PREV,
    btnNext: ATTRIBUTES.PAGINATION.NEXT,
    pageItem: '.pagination__item',
  };

  defaultClasses = {
    active: STATES.ACTIVE,
    hidden: STATES.HIDDEN,
    item: 'pagination__item',
    separator: 'pagination__separator',
  };

  defaultI18n = {
    prev: I18N.PREV_PAGE,
    next: I18N.NEXT_PAGE,
    page: I18N.PAGE,
    current: I18N.CURRENT_PAGE,
    paginationLabel: I18N.PAGINATION_LABEL,
  };

  constructor(renderListInstance, products = [], options = {}) {
    this.renderList = renderListInstance;
    this.products = products;

    this.selectors = { ...this.defaultSelectors, ...options.selectors };
    this.classes = { ...this.defaultClasses, ...options.classes };
    this.i18n = { ...this.defaultI18n, ...options.i18n };

    this.state = {
      currentPage: 1,
      productsPerPage: options.productsPerPage || 12,
      visibleRange: 2, // Установится в initAdaptive
    };

    this.pagination = document.querySelector(this.selectors.pagination);
    this.paginationList = document.querySelector(this.selectors.paginationList);
    this.btnPrev = document.querySelector(this.selectors.btnPrev);
    this.btnNext = document.querySelector(this.selectors.btnNext);

    if (!this.paginationList) {
      return;
    }

    this.init();
  }

  init() {
    this.#initAdaptive();
    this.render();
    this.bindEvents();
    this.#setupAria();
  }

  #setupAria() {
    if (this.btnPrev) {
      this.btnPrev.setAttribute('aria-label', this.i18n.prev);
    }
    if (this.btnNext) {
      this.btnNext.setAttribute('aria-label', this.i18n.next);
    }
    this.pagination?.setAttribute('role', 'navigation');
    this.pagination?.setAttribute('aria-label', this.i18n.paginationLabel);
  }

  /**
   * адаптивность под разные размеры экрана
   */
  #initAdaptive() {
    const updateRange = () => {
      const width = window.innerWidth;
      let newRange = 2; // Desktop по умолчанию

      if (width < 370) {
        newRange = 0; // Очень узкие экраны: 1 ... [5] ... 20
      } else if (width < 768) {
        newRange = 1; // Обычные мобильные: 1 ... 4 [5] 6 ... 20
      }

      if (this.state.visibleRange !== newRange) {
        this.state.visibleRange = newRange;
        this.renderPagination();
      }
    };

    updateRange();

    let timer;
    window.addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(updateRange, 200);
    });
  }

  getPagesCount() {
    return Math.ceil(this.products.length / this.state.productsPerPage);
  }

  render() {
    this.#renderProducts();
    this.renderPagination();
    this.#updateArrowsState();
  }

  #renderProducts() {
    const { currentPage, productsPerPage } = this.state;
    const start = (currentPage - 1) * productsPerPage;
    const productsSlice = this.products.slice(start, start + productsPerPage);

    this.renderList.render(productsSlice);

    if (currentPage > 1) {
      const yOffset = -100;
      const element = this.renderList.container;
      const y =
        (element?.getBoundingClientRect().top || 0) +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  renderPagination() {
    const pagesCount = this.getPagesCount();

    if (pagesCount <= 1) {
      this.pagination?.classList.add(this.classes.hidden);
      return;
    }

    this.paginationList.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const { currentPage, visibleRange } = this.state;

    const leftLimit = currentPage - visibleRange;
    const rightLimit = currentPage + visibleRange;

    for (let i = 1; i <= pagesCount; i++) {
      const isFirstOrLast = i === 1 || i === pagesCount;
      const isWithinRange = i >= leftLimit && i <= rightLimit;

      if (isFirstOrLast || isWithinRange) {
        fragment.append(this.#createPageItem(i));
      } else if (i === leftLimit - 1 && i > 1) {
        fragment.append(this.#createSeparator());
      } else if (i === rightLimit + 1 && i < pagesCount) {
        fragment.append(this.#createSeparator());
      }
    }

    this.paginationList.append(fragment);
    this.pagination?.classList.remove(this.classes.hidden);
  }

  #createPageItem(pageNum) {
    const isCurrent = pageNum === this.state.currentPage;
    const li = document.createElement('li');

    li.className = this.classes.item;
    if (isCurrent) {
      li.classList.add(this.classes.active);
    }

    li.dataset.page = pageNum;
    li.textContent = pageNum;
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.setAttribute(
      'aria-label',
      `${isCurrent ? this.i18n.current : this.i18n.page} ${pageNum}`,
    );

    if (isCurrent) {
      li.setAttribute('aria-current', 'page');
    }

    return li;
  }

  #createSeparator() {
    const li = document.createElement('li');
    li.className = this.classes.separator;
    li.textContent = '...';
    li.setAttribute('aria-hidden', 'true');
    return li;
  }

  #updateArrowsState() {
    const pagesCount = this.getPagesCount();
    const { currentPage } = this.state;

    if (this.btnPrev) {
      const isDisabled = currentPage === 1;
      this.btnPrev.disabled = isDisabled;
      this.btnPrev.setAttribute('aria-disabled', isDisabled);
    }
    if (this.btnNext) {
      const isDisabled = currentPage === pagesCount;
      this.btnNext.disabled = isDisabled;
      this.btnNext.setAttribute('aria-disabled', isDisabled);
    }
  }

  bindEvents() {
    this.paginationList.addEventListener('click', this.onPageClick);
    this.btnNext?.addEventListener('click', this.onNextClick);
    this.btnPrev?.addEventListener('click', this.onPrevClick);

    this.paginationList.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.onPageClick(e);
      }
    });
  }

  onPageClick = (event) => {
    const item = event.target.closest(this.selectors.pageItem);
    if (!item || item.classList.contains(this.classes.active)) {
      return;
    }

    this.state.currentPage = Number(item.dataset.page);
    this.render();
  };

  onNextClick = () => {
    if (this.state.currentPage < this.getPagesCount()) {
      this.state.currentPage++;
      this.render();
    }
  };

  onPrevClick = () => {
    if (this.state.currentPage > 1) {
      this.state.currentPage--;
      this.render();
    }
  };

  updateProducts(products) {
    this.products = products || [];
    this.state.currentPage = 1;
    this.render();
  }
}
