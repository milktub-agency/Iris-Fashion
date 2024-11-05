class TabSwitchFaq extends HTMLElement {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.currentVisibleContent = null;
  }

  connectedCallback() {
    const firstContent = this.querySelector(".collapsible-content--faqs");
    if (firstContent) {
      const header = firstContent.getAttribute("data-header");
      this.currentVisibleContent = document.querySelector(
        `[data-title="${header}"]`
      );
      if (this.currentVisibleContent) {
        this.currentVisibleContent.classList.remove("hidden");
        firstContent.classList.add("active");
      }
    }

    this.querySelectorAll(".collapsible-content--faqs").forEach((e) => {
      e.addEventListener("click", this.handleClick);
    });
  }

  handleClick(e) {
    const header = e.target.getAttribute("data-header");
    const content = document.querySelector(`[data-title="${header}"]`);

    if (this.currentVisibleContent === content) {
      return;
    }
    if (this.currentVisibleContent) {
      this.currentVisibleContent.classList.add("hidden");
      const activeHeader = document.querySelector(
        `.collapsible-content--faqs.active`
      );
      if (activeHeader) {
        activeHeader.classList.remove("active");
      }
    }

    content.classList.remove("hidden");

    e.target.classList.add("active");
    this.currentVisibleContent = content;
  }
}

customElements.define("tab-switch-faq", TabSwitchFaq);
