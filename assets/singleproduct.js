class MobileATCButton extends HTMLElement {
  constructor() {
    super();

    const productID = this.querySelector("button").getAttribute(
      "data-style-with-mobile-atc-toggle"
    );
    this.addEventListener("click", () => {
      this.mobileUpOnClick(productID);
    });
  }

  mobileUpOnClick(productID) {
    const mobileATCDrawers = document.querySelectorAll(
      "[data-style-with-mobile-atc-drawer]"
    );

    let drawerOpened = false;

    mobileATCDrawers.forEach((drawer) => {
      const drawerID = drawer.getAttribute("data-style-with-mobile-atc-drawer");
      if (drawerID === productID) {
        drawer.classList.add("show-mobile-atc");
        drawerOpened = true;  // Flag to track if any drawer was opened

        const productForms = drawer.querySelectorAll(".product-form");
        productForms.forEach(form => {
          if (form.classList.contains("active")) {
            const buttons = document.querySelectorAll('.mobile-atc-drawer__atc-button.placeholder');
            buttons.forEach(button => {
              button.setAttribute('disabled', 'true');       
            });
            form.classList.remove("hidden");
          } else {
            form.classList.add("hidden"); 
          }
        });
      } else {
        drawer.classList.remove("show-mobile-atc");
      }
    });

    // Add `overflow-hidden` to body when any drawer is opened
    if (drawerOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }
}

customElements.define("mobile-atc-button", MobileATCButton);


document.addEventListener("DOMContentLoaded", function () {

  document
    .querySelectorAll("[data-atc-drawer-variant]")
    .forEach(function (button) {
      button.addEventListener("click", assignVariant);
    });

  document
    .querySelectorAll(".mobile-atc-drawer__atc-button")
    .forEach(function (button) {
      button.addEventListener("click", addToCart);
    });
  document
    .querySelectorAll("[data-close-atc-drawer]")
    .forEach(function (button) {
      button.addEventListener("click", closeAtcDrawer);
    });

  var variantButtons = document.querySelectorAll("[data-atc-drawer-variant]");
  var productForms = document.querySelectorAll(".product-form");

  variantButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var variantID = button.getAttribute("data-variant-id");

      productForms.forEach(function (form) {
        form.classList.remove("active");
        if (form.id === "product-form-" + variantID) {
          form.classList.add("active");
        }
      });

      var drawerButtons = document.querySelectorAll("[data-atc-drawer-button]");
      drawerButtons.forEach(function (drawerButton) {
        drawerButton.setAttribute("disabled", true);
        if (drawerButton.getAttribute("data-variant-id") === variantID) {
          drawerButton.removeAttribute("disabled");
        }
      });
    });
  });
});

// Functions

function closeAtcDrawer(e) {
  function removeDisabledAttribute() {
    const buttons = document.querySelectorAll('.mobile-atc-drawer__atc-button.placeholder');
    buttons.forEach(button => {
      button.removeAttribute('disabled');
    });
  }

  removeDisabledAttribute();

  const atcDrawer = e.target.closest("[data-style-with-mobile-atc-drawer]");
  if (atcDrawer) {
    atcDrawer.classList.remove("show-mobile-atc");

    // Revert the hidden class from all product forms
    const productForms = atcDrawer.querySelectorAll(".product-form");
    productForms.forEach(form => {
      form.classList.remove("hidden");
    });

    // Remove `overflow-hidden` class from the body when the drawer closes
    document.body.classList.remove("overflow-hidden");
  }
}


function assignVariant(e) {
  let errorContainer = e.target
    .closest(".mobile-atc-drawer")
    .querySelector("[data-atc-error-text]");
  if (errorContainer) {
    errorContainer.classList.add("error-text--hidden");
  }

  let drawerButtons = e.target
    .closest("[data-style-with-mobile-atc-drawer]")
    .querySelectorAll("[data-atc-drawer-button]");
  let variantID = e.target.dataset.variantId;

  let variantButtons = e.target
    .closest(".product-atc-button__variants")
    .querySelectorAll("[data-atc-drawer-variant]");
  variantButtons.forEach(function (button) {
    button.classList.remove("selected");
  });
  e.target.classList.add("selected");

  drawerButtons.forEach(function (drawerButton) {
    let drawervariantID = drawerButton.getAttribute("data-variant-id");
    drawerButton.setAttribute("disabled", true);
    if (drawervariantID === variantID) {
      drawerButton.removeAttribute("disabled");
    }
  });
}

function addToCart(e) {
  let variantID = e.target.getAttribute("data-variant-id");
  let addButton = e.target;
  let originalButtonText = addButton.textContent;

  let variantSelected = Array.from(
    e.target
      .closest("[data-style-with-mobile-atc-drawer]")
      .querySelectorAll("[data-atc-drawer-variant]")
  ).some((button) => button.classList.contains("selected"));

  if (!variantSelected) {
    let errorContainer = e.target
      .closest(".mobile-atc-drawer")
      .querySelector("[data-atc-error-text]");
    if (errorContainer) {
      errorContainer.classList.remove("error-text--hidden");
      errorContainer.textContent = "Please Make a Selection.";
    }
    return;
  }

  // Show loading state
  addButton.textContent = "Loading...";

  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify({
      id: variantID,
      quantity: 1,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      // Open the cart drawer
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) {
        cartDrawer.classList.add('is-open'); // Adjust class name as needed
      }

      // Update the cart contents
      if (this.cart) {
        this.cart.renderContents(response); // Assuming `this.cart` is defined
      }

      // Close the ATC drawer
      let atcDrawer = e.target.closest("[data-style-with-mobile-atc-drawer]");
      if (atcDrawer) {
        atcDrawer.classList.remove("show-mobile-atc");
      }
    })
    .catch((error) => {
      console.error("Error adding item to cart:", error);
      let errorContainer = e.target
        .closest(".mobile-atc-drawer")
        .querySelector("[data-atc-error-text]");
      if (errorContainer) {
        errorContainer.classList.remove("error-text--hidden");
        errorContainer.textContent = "Error adding to cart. Please try again.";
      }
    })
    .finally(() => {
      // Hide loading state
      addButton.removeAttribute("disabled");
      addButton.textContent = originalButtonText;
    });
}
