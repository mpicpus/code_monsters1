export class Documentation {
  constructor(source) {
    this.source = source || '';

    this.isOpen = false;

    this.element = document.querySelector('#documentation');
    this.elementWrapper = document.querySelector('.documentation-wrapper');
    this.toggleBtn = document.querySelector('.doc-btn');

    this.toggleBtn.addEventListener('click', () => {
      this.toggleOpen();
    });

    this.loadTemplate();
  }

  loadTemplate() {
    let templateId = `#documentation-${this.source}`;
    let template = document.querySelector(templateId);
    this.element.innerHTML = template.innerHTML;
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;

    if (this.isOpen)
      this.elementWrapper.classList.add('open');
    else
      this.elementWrapper.classList.remove('open');
  }
}