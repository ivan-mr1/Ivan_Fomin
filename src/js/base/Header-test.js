class Header {
  selectors = {
    root: '[data-js-header]',
    menu: '[data-js-header-menu]',
    burgerButton: '[data-js-header-burger-button]',
  };

  stateClasses = {
    isActive: 'is-active',
    isLock: 'lock',
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) {
      return;
    }

    this.menuElement = this.rootElement.querySelector(this.selectors.menu);
    this.burgerbuttonElement = this.rootElement.querySelector(
      this.selectors.burgerButton,
    );

    if (!this.menuElement || !this.burgerbuttonElement) {
      return;
    }

    this.bindEvents();
  }

  // Открытие меню
  openMenu() {
    this.burgerbuttonElement.classList.add(this.stateClasses.isActive);
    this.menuElement.classList.add(this.stateClasses.isActive);
    document.body.classList.add(this.stateClasses.isLock);
  }

  // Закрытие меню
  closeMenu() {
    this.burgerbuttonElement.classList.remove(this.stateClasses.isActive);
    this.menuElement.classList.remove(this.stateClasses.isActive);
    document.body.classList.remove(this.stateClasses.isLock);
  }

  // Проверка, открыто ли меню
  isMenuOpen() {
    return this.menuElement.classList.contains(this.stateClasses.isActive);
  }

  // Обработчик клика по бургеру
  onBurgerbuttonClick = () => {
    if (this.isMenuOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  };

  // Обработчик клавиатуры
  onKeyDown = (event) => {
    if (event.key === 'Escape' && this.isMenuOpen()) {
      this.closeMenu();
    }
  };

  bindEvents() {
    this.burgerbuttonElement.addEventListener(
      'click',
      this.onBurgerbuttonClick,
    );
    document.addEventListener('keydown', this.onKeyDown);
  }
}

export default Header;
