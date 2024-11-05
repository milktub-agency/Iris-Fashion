class SplideSlider extends HTMLElement {
  constructor() {
    super();
    this.splideElement = this.querySelector(".splide");
    this.options = JSON.parse(this.dataset.sliderSettings);
    this.mountSplider();
  }

  mountSplider() {
    new Splide(this.splideElement, this.options).mount();
  }
}

customElements.define("splide-slider", SplideSlider);
