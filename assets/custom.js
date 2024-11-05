document.addEventListener("DOMContentLoaded", function () {
  const backScrollButton = document.querySelector(".variant-scroll--back");
  const nextScrollButton = document.querySelector(".variant-scroll--next");

  if (backScrollButton) {
    backScrollButton.addEventListener("click", scrollVariants);
  }

  if (nextScrollButton) {
    nextScrollButton.addEventListener("click", scrollVariants);
  }

  function scrollVariants(e) {
    const scrollDir = e.target.dataset.scrollVariants;
    const scrollTarget = e.target.parentElement.querySelector(
      "[data-variant-scroll-container]"
    );
    const bothScrollButtons = e.target.parentElement.querySelectorAll(
      "[data-scroll-variants]"
    );

    // Scroll amount
    const scrollAmount = 20;

    if (scrollDir === "back") {
      scrollTarget.scrollLeft -= scrollAmount;
    } else if (scrollDir === "forward") {
      scrollTarget.scrollLeft += scrollAmount;
    }

    // Update button states
    updateScrollButtons(scrollTarget, bothScrollButtons);
  }

  function updateScrollButtons(scrollTarget, buttons) {
    // Disable back button if at start
    if (scrollTarget.scrollLeft === 0) {
      buttons[0].classList.add("disabled");
    } else {
      buttons[0].classList.remove("disabled");
    }

    // Disable next button if at end
    const atEnd = scrollTarget.scrollLeft + scrollTarget.offsetWidth >= scrollTarget.scrollWidth;
    if (atEnd) {
      buttons[1].classList.add("disabled");
    } else {
      buttons[1].classList.remove("disabled");
    }
  }
});
