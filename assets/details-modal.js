class DetailsModal extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector("details");
    this.summaryToggle = this.querySelector("summary");
    this.mobNavSearch = document.querySelector(".search__container");

    this.detailsContainer.addEventListener(
      "keyup",
      (event) => event.code.toUpperCase() === "ESCAPE" && this.close()
    );
    this.summaryToggle.addEventListener(
      "click",
      this.onSummaryClick.bind(this)
    );
    this.querySelector('button[type="button"]')?.addEventListener(
      "click",
      this.close.bind(this)
    );

    this.summaryToggle.setAttribute("role", "button");
    this.mobNavSearch?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.summaryToggle.click();
    });
  }

  isOpen() {
    return this.detailsContainer.hasAttribute("open");
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest("details").hasAttribute("open")
      ? this.close()
      : this.open(event);
  }

  onBodyClick(event) {
    if (
      !this.contains(event.target) ||
      event.target.classList.contains("modal-overlay")
    )
      this.close(false);
  }

  open(event) {
    this.onBodyClickEvent =
      this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest("details").setAttribute("open", true);
    document.body.addEventListener("click", this.onBodyClickEvent);
    document.body.classList.add("overflow-hidden");
    document.querySelector(".mob__nav__container")?.classList.add("animate");
    document
      .querySelector(".filters__sortby__container")
      ?.classList.add("animate");

    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    );
  }

  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    this.detailsContainer.removeAttribute("open");
    document.body.removeEventListener("click", this.onBodyClickEvent);
    document.querySelector(".mob__nav__container")?.classList.remove("animate");
    document
      .querySelector(".filters__sortby__container")
      ?.classList.remove("animate");
    document.body.classList.remove("overflow-hidden");
  }
}

customElements.define("details-modal", DetailsModal);
