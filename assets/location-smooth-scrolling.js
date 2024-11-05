class SmoothScrollElement extends HTMLElement {
  constructor() {
    super();
    this.isScrolling = false;
    this.scrollTimeout = null;
  }

  connectedCallback() {
    this.addEventListeners();
    this.observeTargetElements();
  }

  addEventListeners() {
    this.querySelectorAll(".grid__item").forEach((item) => {
      item.addEventListener("click", this.handleClick.bind(this));
    });
  }

  handleClick(event) {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      this.isScrolling = true;
      window.scrollTo({
        top: targetElement.offsetTop - 200,
        behavior: "smooth",
      });
      this.querySelectorAll(".grid__item").forEach((item) => {
        item.classList.remove("active");
      });
      event.currentTarget.classList.add("active");
      this.checkScrollEnd();
    }
  }
//handling edge case where the on click it pass through all the titles

  checkScrollEnd() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      requestAnimationFrame(() => {
        this.isScrolling = false;
      });
    }, 1000); 
  }

  observeTargetElements() {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!this.isScrolling) {
          entries.forEach((entry) => {
            const targetElement = entry.target;
            const targetId = targetElement.id;
            const gridItem = this.querySelector(`[href="#${targetId}"]`);

            if (entry.isIntersecting) {
              gridItem.classList.add("active");
            } else {
              gridItem.classList.remove("active");
            }
          });
        }
      },
      {
        root: null,
        threshold: .75, 
      }
    );

    this.querySelectorAll(".grid__item").forEach((item) => {
      const targetId = item.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        observer.observe(targetElement);
      }
    });
  }
}

customElements.define("smooth-scroll-element", SmoothScrollElement);
