class Header {
  selectors = {
    root: '[data-header]',
    menu: '[data-header-menu]',
    burgerButton: '[data-header-burger-btn]',
    overlay: '.header__overlay',
  };

  stateClasses = {
    isActive: 'is-active',
    isLock: 'lock',
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) {
      console.error('Header root element not found');
      return;
    }

    this.menuElement = this.rootElement.querySelector(this.selectors.menu);
    this.burgerButtonElement = this.rootElement.querySelector(
      this.selectors.burgerButton,
    );
    this.overlayElement = this.rootElement.querySelector(
      this.selectors.overlay,
    );

    this.bindEvents();
  }

  openMenu() {
    this.burgerButtonElement.classList.add(this.stateClasses.isActive);
    this.menuElement.classList.add(this.stateClasses.isActive);
    document.body.classList.add(this.stateClasses.isLock);
  }

  closeMenu() {
    this.burgerButtonElement.classList.remove(this.stateClasses.isActive);
    this.menuElement.classList.remove(this.stateClasses.isActive);
    document.body.classList.remove(this.stateClasses.isLock);
  }

  toggleMenu = () => {
    const isOpen = this.menuElement.classList.contains(
      this.stateClasses.isActive,
    );
    isOpen ? this.closeMenu() : this.openMenu();
  };

  onEscapePress = (e) => {
    if (e.key === 'Escape') {
      this.closeMenu();
    }
  };

  onOverlayClick = (e) => {
    if (e.target === this.overlayElement) {
      this.closeMenu();
    }
  };

  onMenuClick = (event) => {
    const target = event.target;
    if (target.closest('a.menu__link') || target.closest('button')) {
      this.closeMenu();
    }
  };

  bindEvents() {
    if (!this.burgerButtonElement || !this.menuElement) {
      console.error('Burger button or menu element not found');
      return;
    }

    this.burgerButtonElement.addEventListener('click', this.toggleMenu);

    this.menuElement.addEventListener('click', this.onMenuClick);

    if (this.overlayElement) {
      this.overlayElement.addEventListener('click', this.onOverlayClick);
    }

    document.addEventListener('keydown', this.onEscapePress);
  }

  destroy() {
    if (!this.burgerButtonElement || !this.menuElement) {
      return;
    }

    this.burgerButtonElement.removeEventListener('click', this.toggleMenu);

    this.menuElement.removeEventListener('click', this.onMenuClick);

    if (this.overlayElement) {
      this.overlayElement.removeEventListener('click', this.onOverlayClick);
    }

    document.removeEventListener('keydown', this.onEscapePress);
  }
}

export default Header;
