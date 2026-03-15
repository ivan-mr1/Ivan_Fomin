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
    this.showMoreButton = null;
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
    if (nextSibling?.classList?.contains('show-more-container')) {
      this.controlsContainer = nextSibling;
      return;
    }

    this.controlsContainer = document.createElement('div');
    this.controlsContainer.className = 'show-more-container';
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
    return this.showMoreButton;
  }

  render() {
    const filteredProjects = this.getFilteredProjects();
    const visibleProjects = this.getVisibleProjects();

    const fragment = document.createDocumentFragment();
    visibleProjects.forEach((project) =>
      fragment.append(this.createProjectCard(project)),
    );
    this.rootElement.replaceChildren(fragment);

    this.ensureControlsContainer();

    const remaining = filteredProjects.length - this.visibleCount;

    if (remaining > 0) {
      const button = this.createShowMoreButton();
      button.setText(`show more ${remaining}`);
      button.show();
    } else if (this.showMoreButton) {
      this.showMoreButton.hide();
    }
  }
}
