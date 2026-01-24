import projects from './projects.js';
import ProjectCard from './ProjectCard.js';

export default class Portfolio {
  selectors = {
    root: '[data-portfolio]',
  };

  constructor() {
    this.root = document.querySelector(this.selectors.root);

    if (!this.root) {
      return;
    }

    this.renderProjects();
  }

  renderProjects() {
    this.root.innerHTML = '';

    projects.forEach((project) => {
      const card = new ProjectCard(project);
      this.root.append(card.renderElement());
    });
  }
}
