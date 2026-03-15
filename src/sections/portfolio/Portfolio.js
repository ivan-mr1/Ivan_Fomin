import projects from './projects.js';
import ProjectCard from './ProjectCard.js';

export const TAB_TECH_MAP = {
  htmlcss: ['HTML', 'CSS', 'SCSS'],
  javascript: ['JavaScript'],
  react: ['React'],
  vue: ['Vue.js'],
};

export default class Portfolio {
  constructor(rootElement) {
    this.rootElement = rootElement;

    this.filters = {
      tab: rootElement.dataset.portfolio || 'all',
      category: 'all',
      pageType: 'all',
      year: 'all',
      tech: 'all',
      search: '',
    };

    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.visibleCount = 12;
    this.increment = 4;

    this.renderProjects();
  }

  createPagination(totalPages) {
    const pagination = document.createElement('div');
    pagination.className = 'portfolio__pagination pagination';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination__button pagination__prev';
    prevButton.textContent = 'Предыдущая';
    prevButton.disabled = this.currentPage === 1;
    prevButton.addEventListener('click', () =>
      this.goToPage(this.currentPage - 1),
    );
    pagination.append(prevButton);

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2),
    );
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = `pagination__button pagination__page ${i === this.currentPage ? 'is-active' : ''}`;
      pageButton.textContent = i;
      pageButton.addEventListener('click', () => this.goToPage(i));
      pagination.append(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination__button pagination__next';
    nextButton.textContent = 'Следующая';
    nextButton.disabled = this.currentPage === totalPages;
    nextButton.addEventListener('click', () =>
      this.goToPage(this.currentPage + 1),
    );
    pagination.append(nextButton);

    return pagination;
  }

  showMore() {
    this.visibleCount += this.increment;
    const filteredProjects = projects.filter((project) =>
      this.matchesFilters(project),
    );
    this.visibleCount = Math.min(this.visibleCount, filteredProjects.length);
    const newTotalPages = Math.ceil(this.visibleCount / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, newTotalPages);
    this.renderProjects();
  }

  goToPage(page) {
    this.currentPage = page;
    this.renderProjects();
  }

  setFilter(key, value) {
    this.filters[key] = value;
    this.currentPage = 1;
    this.visibleCount = 12; // Reset on filter change
    this.renderProjects();
  }

  matchesFilters(project) {
    const { tab, category, pageType, year, tech, search } = this.filters;

    if (tab !== 'all') {
      const allowedTechs = TAB_TECH_MAP[tab] ?? [];
      if (!project.techStack.some((t) => allowedTechs.includes(t))) {
        return false;
      }
    }

    if (category !== 'all' && project.category !== category) {
      return false;
    }
    if (pageType !== 'all' && project.pageType !== pageType) {
      return false;
    }
    if (year !== 'all' && project.year !== year) {
      return false;
    }
    if (tech !== 'all' && !project.techStack.includes(tech)) {
      return false;
    }
    if (search && !project.name.toLowerCase().includes(search)) {
      return false;
    }

    return true;
  }

  renderProjects() {
    const filteredProjects = projects.filter((project) =>
      this.matchesFilters(project),
    );
    this.visibleCount = Math.min(this.visibleCount, filteredProjects.length);

    const totalPages = Math.ceil(this.visibleCount / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.visibleCount,
    );
    const visibleProjects = filteredProjects.slice(startIndex, endIndex);

    const fragment = document.createDocumentFragment();

    visibleProjects.forEach((project) =>
      fragment.append(new ProjectCard(project).renderElement()),
    );

    // Remove existing elements
    const existingShowMore = this.rootElement.querySelector(
      '.portfolio__show-more',
    );
    if (existingShowMore) {
      existingShowMore.remove();
    }
    const existingPagination = this.rootElement.querySelector(
      '.portfolio__pagination',
    );
    if (existingPagination) {
      existingPagination.remove();
    }

    // Add show more button if there are more projects to load
    if (filteredProjects.length > this.visibleCount) {
      const showMoreButton = document.createElement('button');
      showMoreButton.className = 'portfolio__show-more';
      showMoreButton.textContent = 'Показать еще';
      showMoreButton.addEventListener('click', () => this.showMore());
      fragment.append(showMoreButton);
    }

    // Add pagination if there are multiple pages in visible projects
    if (totalPages > 1) {
      const pagination = this.createPagination(totalPages);
      fragment.append(pagination);
    }

    this.rootElement.replaceChildren(fragment);
  }
}
