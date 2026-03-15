/**
 * Simple module that encapsulates the "Show more" button and its click logic.
 *
 * Usage:
 *   const button = new ShowMoreButton({
 *     container: document.querySelector('.container'),
 *     onClick: () => { ... },
 *   });
 *
 *   // Control state:
 *   button.setLoading(true);
 *   button.setText('Еще немного');
 *
 *   // Cleanup:
 *   button.destroy();
 */

export default class ShowMoreButton {
  constructor({
    container = null,
    text = 'Показать еще',
    loadingText = 'Загрузка...',
    className = 'portfolio__show-more',
    onClick,
    attrs = {},
  } = {}) {
    if (typeof onClick !== 'function') {
      throw new Error('ShowMoreButton requires an onClick callback');
    }

    this.container = container instanceof Element ? container : null;
    this.text = text;
    this.loadingText = loadingText;
    this.className = className;
    this.attrs = attrs;
    this.onClick = onClick;

    this.isLoading = false;

    this.element = this.createElement();

    if (this.container) {
      this.container.appendChild(this.element);
    }
  }

  createElement() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = this.className;

    this.textNode = document.createElement('span');
    this.textNode.textContent = this.text;

    this.spinner = document.createElement('span');
    this.spinner.className = `${this.className}__spinner`;
    this.spinner.setAttribute('aria-hidden', 'true');
    this.spinner.style.display = 'none';

    button.append(this.spinner, this.textNode);

    Object.entries(this.attrs).forEach(([key, value]) => {
      button.setAttribute(key, value);
    });

    button.addEventListener('click', this.onClick);

    return button;
  }

  setText(text) {
    this.text = text;
    if (this.textNode) {
      this.textNode.textContent = text;
    }
  }

  setLoading(isLoading = true) {
    this.isLoading = isLoading;
    this.element.disabled = isLoading;
    this.spinner.style.display = isLoading ? '' : 'none';
    this.setText(isLoading ? this.loadingText : this.text);
  }

  show() {
    this.element.style.display = '';
  }

  hide() {
    this.element.style.display = 'none';
  }

  destroy() {
    this.element.removeEventListener('click', this.onClick);
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
  }
}
