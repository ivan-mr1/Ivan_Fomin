import PortfolioBase from './PortfolioBase.js';
import ProjectCard from './ProjectCard.js';
import ShowMoreButton from '@components/showMoreButton/ShowMoreButton.js';
import projects from './projects.js';

export default class Portfolio extends PortfolioBase {
  constructor(rootElement) {
    super(projects);

    this.rootElement = rootElement;
    this.filters.tab = rootElement.dataset.portfolio || 'all';

    this.controlsContainer = null;
  }

  init() {
    this.ensureControlsContainer();
    this.render();
  }

  ensureControlsContainer() {
    if (
      this.controlsContainer &&
      this.rootElement.contains(this.controlsContainer)
    ) {
      return;
    }

    const nextSibling = this.rootElement.nextElementSibling;
    const isExisting = nextSibling?.classList?.contains(
      'portfolio__controls-container',
    );

    if (isExisting) {
      this.controlsContainer = nextSibling;
      return;
    }

    this.controlsContainer = document.createElement('div');
    this.controlsContainer.className = 'portfolio__controls-container';
    this.rootElement.after(this.controlsContainer);
  }

  setFilter(key, value) {
    super.setFilter(key, value);
    this.render();
  }

  showMore() {
    this.increaseVisibleCount();
    this.render();
  }

  createProjectCard(project) {
    return new ProjectCard(project).renderElement();
  }

  createShowMoreButton() {
    if (!this.showMoreButton) {
      this.showMoreButton = new ShowMoreButton({
        container: this.controlsContainer,
        onClick: () => this.showMore(),
      });
    }

    return this.showMoreButton.element;
  }

  render() {
    const filteredProjects = this.getFilteredProjects();
    const visibleProjects = this.getVisibleProjects();

    const listFragment = document.createDocumentFragment();
    visibleProjects.forEach((project) =>
      listFragment.append(this.createProjectCard(project)),
    );

    this.rootElement.replaceChildren(listFragment);

    this.ensureControlsContainer();

    const remaining = Math.max(0, filteredProjects.length - this.visibleCount);

    if (remaining > 0) {
      this.createShowMoreButton();
      this.showMoreButton.setText(`Еще ${remaining}`);
      this.showMoreButton.show();
    } else if (this.showMoreButton) {
      this.showMoreButton.hide();
    }
  }
}
