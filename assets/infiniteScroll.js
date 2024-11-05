class InfiniteScroll extends HTMLElement {
  constructor() {
    super();
    this.currentPage = 1;
    this.collectionHandle = this.getAttribute("data-collection");
    this.loader = this.querySelector("#infinite-scroll-loader");
    this.container = this.querySelector("#product-grid");
    this.handleScroll = this.handleScroll.bind(this);
    this.loadMoreProducts = this.loadMoreProducts.bind(this);
    this.isFetching = false;
    window.addEventListener("scroll", this.handleScroll);
  }

  connectedCallback() {
    this.loadMoreProducts();
  }

  loadMoreProducts() {
    if (this.isFetching) return;
    this.isFetching = true;
    this.loader.classList.remove("hidden");
    this.loader.classList.add("visible");
    this.currentPage += 1;

    fetch(
      `/collections/${this.collectionHandle}?page=${this.currentPage}&view=infinite-scroll`,
      {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newProducts = doc.querySelectorAll(".product-card");

        if (newProducts.length > 0) {
          const fragment = document.createDocumentFragment();
          const newProductElements = [];

          newProducts.forEach((product) => {
            product.classList.add("hidden");
            fragment.appendChild(product);
            newProductElements.push(product);
          });

          this.container.appendChild(fragment);

          requestAnimationFrame(() => {
            newProductElements.forEach((product) => {
              product.classList.remove("hidden");
            });
          });
        } else {
          window.removeEventListener("scroll", this.handleScroll);
        }
        this.loader.classList.remove("visible");
        this.loader.classList.add("hidden");
        this.isFetching = false;
      })
      .catch((error) => {
        console.error("Error loading more products:", error);
        this.loader.classList.remove("visible");
        this.loader.classList.add("hidden");
        this.isFetching = false;
      });
  }

  handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 100) {
      this.loadMoreProducts();
    }
  }
}

window.customElements.define("infinite-scroll", InfiniteScroll);
