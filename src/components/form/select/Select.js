import BaseComponent from '@js/BaseComponent';
import MatchMedia from '@js/function/MatchMedia';

const rootSelector = '[data-js-select]';

class Select extends BaseComponent {
  selectors = {
    originalControl: '[data-js-select-original-control]',
    button: '[data-js-select-button]',
    dropdown: '[data-js-select-dropdown]',
    option: '[data-js-select-option]',
  };

  stateClasses = {
    isExpanded: 'is-expanded',
    isSelected: 'is-selected',
    isCurrent: 'is-current',
    isOnTheLeftSide: 'is-on-the-left-side',
    isOnTheRightSide: 'is-on-the-right-side',
  };

  stateAttributes = {
    ariaExpanded: 'aria-expanded',
    ariaSelected: 'aria-selected',
    ariaActiveDescendant: 'aria-activedescendant',
  };

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.originalControlElement = rootElement.querySelector(
      this.selectors.originalControl,
    );
    this.buttonElement = rootElement.querySelector(this.selectors.button);
    this.dropdownElement = rootElement.querySelector(this.selectors.dropdown);
    this.optionElements = [
      ...this.dropdownElement.querySelectorAll(this.selectors.option),
    ];

    this.state = this.getProxyState({
      isExpanded: false,
      currentOptionIndex: this.originalControlElement.selectedIndex,
      selectedOptionElement:
        this.optionElements[this.originalControlElement.selectedIndex],
    });

    this.fixDropdownPosition();
    this.updateTabIndexes();
    this.bindEvents();
  }

  updateUI() {
    const { isExpanded, currentOptionIndex, selectedOptionElement } =
      this.state;
    const label = selectedOptionElement.textContent.trim();

    this.buttonElement.textContent = label;
    this.buttonElement.classList.toggle(
      this.stateClasses.isExpanded,
      isExpanded,
    );
    this.buttonElement.setAttribute(
      this.stateAttributes.ariaExpanded,
      isExpanded,
    );
    this.buttonElement.setAttribute(
      this.stateAttributes.ariaActiveDescendant,
      this.optionElements[currentOptionIndex].id,
    );

    this.dropdownElement.classList.toggle(
      this.stateClasses.isExpanded,
      isExpanded,
    );

    this.optionElements.forEach((optionElement, index) => {
      const isCurrent = index === currentOptionIndex;
      const isSelected = optionElement === selectedOptionElement;
      optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent);
      optionElement.classList.toggle(this.stateClasses.isSelected, isSelected);
      optionElement.setAttribute(this.stateAttributes.ariaSelected, isSelected);
    });
  }

  syncNativeControl() {
    const index = this.optionElements.indexOf(this.state.selectedOptionElement);
    this.originalControlElement.selectedIndex = index;
    this.originalControlElement.dispatchEvent(
      new Event('change', { bubbles: true }),
    );
  }

  expand() {
    this.state.isExpanded = true;
  }

  collapse() {
    this.state.isExpanded = false;
  }

  toggleExpandedState() {
    this.state.isExpanded = !this.state.isExpanded;
  }

  selectCurrentOption() {
    this.state.selectedOptionElement =
      this.optionElements[this.state.currentOptionIndex];
    this.syncNativeControl();
  }

  fixDropdownPosition() {
    const viewportWidth = document.documentElement.clientWidth;
    const { width, x } = this.buttonElement.getBoundingClientRect();
    const isOnLeftSide = x + width / 2 < viewportWidth / 2;

    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      isOnLeftSide,
    );
    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheRightSide,
      !isOnLeftSide,
    );
  }

  updateTabIndexes(isMobileDevice = MatchMedia.mobile.matches) {
    this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1;
    this.buttonElement.tabIndex = isMobileDevice ? -1 : 0;
  }

  get isNeedToExpand() {
    return (
      !this.state.isExpanded && document.activeElement === this.buttonElement
    );
  }

  onButtonClick = () => {
    this.toggleExpandedState();
  };

  onClick = (event) => {
    const { target } = event;
    const isButtonClick = target === this.buttonElement;
    const isOutsideDropdown =
      target.closest(this.selectors.dropdown) !== this.dropdownElement;

    if (!isButtonClick && isOutsideDropdown) {
      this.collapse();
      return;
    }

    if (target.matches(this.selectors.option)) {
      const index = this.optionElements.indexOf(target);
      this.state.currentOptionIndex = index;
      this.state.selectedOptionElement = target;
      this.syncNativeControl();
      this.collapse();
    }
  };

  onArrowUpKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    if (this.state.currentOptionIndex > 0) {
      this.state.currentOptionIndex--;
    }
  };

  onArrowDownKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    if (this.state.currentOptionIndex < this.optionElements.length - 1) {
      this.state.currentOptionIndex++;
    }
  };

  onSpaceKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    this.selectCurrentOption();
    this.collapse();
  };

  onEnterKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }
    this.selectCurrentOption();
    this.collapse();
  };

  onKeyDown = (event) => {
    const action = {
      ArrowUp: this.onArrowUpKeyDown,
      ArrowDown: this.onArrowDownKeyDown,
      Space: this.onSpaceKeyDown,
      Enter: this.onEnterKeyDown,
    }[event.code];

    if (action) {
      event.preventDefault();
      action();
    }
  };

  onMobileMatchMediaChange = (event) => {
    this.updateTabIndexes(event.matches);
  };

  onOriginalControlChange = () => {
    const index = this.originalControlElement.selectedIndex;
    this.state.selectedOptionElement = this.optionElements[index];
    this.state.currentOptionIndex = index;
  };

  bindEvents() {
    MatchMedia.mobile.addEventListener('change', this.onMobileMatchMediaChange);
    this.buttonElement.addEventListener('click', this.onButtonClick);
    document.addEventListener('click', this.onClick);
    this.rootElement.addEventListener('keydown', this.onKeyDown);
    this.originalControlElement.addEventListener(
      'change',
      this.onOriginalControlChange,
    );
  }
}

class SelectCollection {
  constructor() {
    this.selects = [];
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      this.selects.push(new Select(element));
    });
  }
}

export default SelectCollection;
