class TabSwitch extends HTMLElement {
  constructor() {
    super();
    this.buttons = [];
    this.contents = [];
  }

  connectedCallback() {
    this.buttons = Array.from(this.querySelectorAll(".tabs-button"));
    this.contents = Array.from(this.querySelectorAll(".tabs-content"));

    this.buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons and contents
        this.buttons.forEach((btn) => btn.classList.remove("active"));
        this.contents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked button and corresponding content
        button.classList.add("active");
        this.contents[index].classList.add("active");
      });
    });
  }
}

customElements.define("tab-switch", TabSwitch);
