class JavaScriptInjectedSection extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    // Getting the selectors for target locations
    this.targetLocationSelectors = [
      this.dataset["targetLocation"],
      this.dataset["targetLocation2"],
    ].filter((selector) => selector); 

    this.targetLocations = this.targetLocationSelectors.map((selector) =>
      document.querySelector(selector)
    );

    this.targetLocations.forEach((targetLocation) => {
      if (targetLocation) {
        targetLocation.innerHTML = this.innerHTML;
      }
    });
  }
}

customElements.define("javascript-injected-section", JavaScriptInjectedSection);

class JavaScriptInjectedSectionHamburger extends JavaScriptInjectedSection {
  constructor() {
    super();
  }

  connectedCallback() {
    document.querySelector("header-drawer").bindEvents();
  }
}

customElements.define(
  "javascript-injected-section-hamburger",
  JavaScriptInjectedSectionHamburger
);
