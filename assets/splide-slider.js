class SplideSlider extends HTMLElement {
  constructor() {
    super();
    this.splideElement = this.querySelector(".splide");
    this.options = JSON.parse(this.dataset.sliderSettings);
    this.imageContainer = this.querySelector(".hover-trigger");

    // Add event listeners to the image container only
    if (this.imageContainer) {
      this.imageContainer.addEventListener("mouseenter", () =>
        this.mountSplider()
      );
      this.imageContainer.addEventListener("mouseleave", () =>
        this.destroySplider()
      );
    }
  }

  mountSplider() {
    const startIndex = parseInt(this.dataset.startIndex, 10) || 0;
    if (!this.splideInstance) {
      this.splideInstance = new Splide(this.splideElement, {
        ...this.options,
        start: startIndex,
      }).mount();
    }
  }

  destroySplider() {
    if (this.splideInstance) {
      const currentIndex = this.splideInstance.index;
      this.dataset.startIndex = currentIndex;
      this.splideInstance.destroy();
      this.splideInstance = null;
    }
  }
}

customElements.define("splide-slider", SplideSlider);
