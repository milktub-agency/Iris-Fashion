class BrandsFilter {
  constructor(elem) {
    this._elem = elem;
    this._filterSelector = ".brands-filter__char";
    this._allFilters = document.querySelectorAll(this._filterSelector);
    this._letterSelector = ".brands-list__letter";
    this._allLetters = document.querySelectorAll(this._letterSelector);
    this._brandsList = document.querySelector(".brands-list");
    this._filter = elem.getAttribute("data-brands-filter");
    this._matchingLetter = document.querySelector(
      `${this._letterSelector}[data-brands-letter="${this._filter}"]`
    );
  }

  onInit() {
    this._elem.addEventListener("click", () => {
      if (this._filter === "clear") {
        this._clear();
      } else {
        if (this._elem.classList.contains("active")) {
          this._deselectFilter();
        } else {
          this._selectFilter();
        }
      }
    });
  }

  _selectFilter() {
    this._elem.classList.add("active");
    this._allFilters.forEach((filter) => {
      if (filter !== this._elem && filter.classList.contains("active")) {
        filter.classList.remove("active");
      }
    });

    this._brandsList.classList.add("active");
    this._allLetters.forEach((letter) => {
      if (
        letter !== this._matchingLetter &&
        letter.classList.contains("active")
      ) {
        letter.classList.remove("active");
      }
    });
    this._matchingLetter.classList.add("active"); // Ensure the letter gets the active class
    this._scrollTo();
  }

  _deselectFilter() {
    this._elem.classList.remove("active");
    this._brandsList.classList.remove("active");
    this._matchingLetter.classList.remove("active");
  }

  _clear() {
    this._allFilters.forEach((filter) => {
      if (filter.classList.contains("active")) {
        filter.classList.remove("active");
      }
    });
    this._brandsList.classList.remove("active");
    this._allLetters.forEach((letter) => {
      if (letter.classList.contains("active")) {
        letter.classList.remove("active");
      }
    });
  }

  _scrollTo() {
    this._smoothScrollTo(this._matchingLetter, -200, 400);
  }

  _smoothScrollTo(target, offset, duration) {
    const startY = window.pageYOffset;
    const targetY = target.getBoundingClientRect().top + startY + offset;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easing = progress * (2 - progress);

      window.scrollTo(0, startY + (targetY - startY) * easing);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }
}

class ScrollTo {
  constructor(elem) {
    this._elem = elem;
    this._data = JSON.parse(elem.getAttribute("data-scroll-to"));
    this._targetElem =
      document.querySelector(this._data.targetElem) || document.documentElement;
    this._offset = this._data.offset || -109;
    this._duration = this._data.duration || 400;
  }

  onInit() {
    this._elem.addEventListener("click", () => {
      this._smoothScrollTo(this._targetElem, this._offset, this._duration);
    });
  }

  _smoothScrollTo(target, offset, duration) {
    const startY = window.pageYOffset;
    const targetY = target.getBoundingClientRect().top + startY + offset;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easing = progress * (2 - progress);

      window.scrollTo(0, startY + (targetY - startY) * easing);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }
}

document
  .querySelectorAll(".brands-filter__char, .brands-filter__clear")
  .forEach((elem) => {
    const brandsFilter = new BrandsFilter(elem);
    brandsFilter.onInit();
  });

document.querySelectorAll(".scroll-to").forEach((elem) => {
  const scrollTo = new ScrollTo(elem);
  scrollTo.onInit();
});
