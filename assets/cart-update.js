
class CartUpdate {
  constructor(theme, elem) {
    this.theme = theme;
    this._elem = elem;
    this._data = JSON.parse(elem.getAttribute("data-cart-update"));
    this._action = this._data.action;
    this._preOrder = this._data.preOrder;
    this._event = this._data.event || "click";
    this._product = getClosest(this._elem, "[data-product]");
    this._cartSelector = this._data._cartSelector || ".slideout-cart";
    this._cartItemSelector = this._data._cartItemSelector || ".cart-item";
    this._delay = this._data.delay || 0;
    log.debug(this.constructor.name, "Constructed", this);
  }

  onInit() {
    this._elem.addEventListener(this._event, (e) => {
      e.preventDefault();
      setTimeout(() => {
        const variantID =
          this._data.variantID ||
          parseInt(
            this._product.querySelector("[data-product-selected-variant]").value
          );
        this[`_${this._action}`](variantID);
      }, this._delay);
    });
  }

  _add(variantID) {
    const self = this;
    const quantity =
      this._product && this._product.querySelector("[data-product-quantity]")
        ? parseInt(this._product.querySelector("[data-product-quantity]").value)
        : 1;
    let productProperties = {};

    if (this._data.delay) {
      console.log(
        "VARIANT ID: ",
        variantID,
        parseInt(
          this._product.querySelector("[data-product-selected-variant]").value
        )
      );
      variantID = parseInt(
        this._product.querySelector("[data-product-selected-variant]").value
      );
    }

    let addProduct = true;
    let ui = true;

    if (this._data.conditions) {
      addProduct = false;
      if (this._data.conditions.class) {
        if (this._elem.classList.contains(this._data.conditions.class)) {
          addProduct = true;
          ui = false;
        } else {
          this._remove(variantID, false);
        }
      }
    }

    if (this._preOrder) {
      productProperties["Pre-order"] = "True";
      if (this._preOrder["estimatedDispatch"]) {
        productProperties[
          "Pre-order"
        ] = `Estimated ${this._preOrder["estimatedDispatch"]}`;
      }
      console.log({ productProperties });
    }

    if (addProduct) {
      // get variant id (based on whether or not user has personalization)
      axios.get("/cart.js").then((response) => {
        let alreadyExists = false;
        const items = response.data.items;
        for (let i = 0; i < items.length; i++) {
          const itemID = items[i].variant_id;
          if (itemID === variantID) {
            alreadyExists = true;
          }
        }

        // add product to cart
        axios
          .post("/cart/add.js", {
            quantity: quantity,
            id: variantID,
            properties: productProperties,
          })
          .then(function (response) {
            if (alreadyExists) {
              if (ui) {
                self._updateCartCount();
                self._openCart();
              }
            } else {
              console.log(response);
              if (ui) {
                self._addCartItem(response.data);
                self._updateCartCount();
              }
            }
          })
          .catch(function (error) {
            console.error(error);
            if (!variantID) {
              const errorMesses = document.querySelectorAll(
                ".product__make-selection"
              );
              errorMesses.forEach((message) => {
                message.classList.remove("visually-hidden");
              });
            }
          });
      });
    }
  }

  _addCartItem(product) {
    const cart = document.querySelector(this._cartSelector);
    const cartItems = cart.querySelector(".cart-items");

    // Pre order logic
    let preOrderHTML = "";
    if (this._preOrder) {
      preOrderHTML = "Pre-order";
      if (this._preOrder["estimatedDispatch"]) {
        preOrderHTML += `: Estimated ${this._preOrder["estimatedDispatch"]}`;
      }
      preOrderHTML =
        `<div class="cart-item__pre-order">` + preOrderHTML + `</div>`;
      console.log({ preOrderHTML });
    }

    const image = getSizedImageUrl(product.image, "180x");
    const newCartItem = document.createElement("div");
    // const maxQuantity = parseInt(this._product.querySelector('[data-max-quantity]').getAttribute('data-max-quantity'))
    newCartItem.classList.add("cart-item");
    newCartItem.setAttribute("data-product", "");
    let newCartItemHTML = `
            <a href="${product.url}" class="cart-item__image object-contain">
                <img src="${image}" loading="lazy">
            </a>
            <div class="cart-item__info">
                <h2 class="cart-item__title">${product.title}</h2>
                ${preOrderHTML}
                <p class="product-price">${getPrice(product.price)}</p>
                <div class="cart-item__actions flex f-space-between">
                    <div class="product-quantity flex f-vertical-center">
                        <button class="product-quantity__button" data-quantity='{ "action": "decrease" }' data-cart-update='{ "action": "updateQuantity", "variantID": ${
                          product.variant_id
                        } }'>-</button>
                        <input class="product-quantity__input" data-quantity='{ "event": "keyup" }' data-cart-update='{ "event": "keyup", "action": "updateQuantity", "variantID": ${
                          product.variant_id
                        } }' data-product-quantity type="number" value="${
      product.quantity
    }">
                        <button class="product-quantity__button" data-quantity='{ "action": "increase" }' data-cart-update='{ "action": "updateQuantity", "variantID": ${
                          product.variant_id
                        } }'>+</button>
                    </div>
                    <button class="xs uc bold underline" data-cart-update='{ "action": "remove", "variantID": ${
                      product.variant_id
                    } }'>Remove</button>
                </div>
            </div>
        `;

    newCartItem.innerHTML = newCartItemHTML;

    cartItems.appendChild(newCartItem);
    cart.classList.remove("cart-empty");
    this._openCart();

    this.theme.registerComponents(newCartItem);
  }

  _remove(variantID, ui = true) {
    const self = this;
    axios
      .post("/cart/update.js", {
        updates: {
          [variantID]: 0,
        },
      })
      .then((response) => {
        self._updateCartTotal(response.data);
        self._updateCartCount();
        if (ui) {
          self._removeCartItem(variantID);
        }
        if (response.data.item_count === 0) {
          const cart = document.querySelector(this._cartSelector);
          cart.classList.add("cart-empty");
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  _removeCartItem(variantID) {
    getClosest(this._elem, this._cartItemSelector).remove();
  }

  _updateQuantity(variantID) {
    const self = this;
    const quantity =
      parseInt(this._elem.value) ||
      parseInt(this._product.querySelector("[data-product-quantity]").value);
    axios
      .post("/cart/update.js", {
        updates: {
          [variantID]: quantity,
        },
      })
      .then((response) => {
        self._updateCartTotal(response.data);
        self._updateCartCount();
        if (quantity <= 0) {
          self._removeCartItem(variantID);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  _updateCartTotal(cart) {
    const cartTotalElems = document.querySelectorAll("[data-cart-total]");
    if (cartTotalElems.length) {
      for (let i = 0; i < cartTotalElems.length; i++) {
        cartTotalElems[i].textContent = getPrice(
          cart.total_price,
          cart.currency
        );
      }
    }
  }

  _updateCartCount(cart) {
    axios.get("/cart.js").then((response) => {
      let subtwo = new SubTwo();
      subtwo.sendBasket(response.data);
      const cartItemCount = response.data.item_count;
      const cartIcons = document.querySelectorAll("[data-cart-count]");
      for (var i = 0; i < cartIcons.length; i++) {
        const cartIcon = cartIcons[i];
        if (cartItemCount > 0) {
          if (!cartIcon.classList.contains("has-items")) {
            cartIcon.classList.add("has-items");
          }
          cartIcon.setAttribute("data-cart-count", cartItemCount);
        } else {
          cartIcon.setAttribute("data-cart-count", "");
          if (cartIcon.classList.contains("has-items")) {
            cartIcon.classList.remove("has-items");
          }
        }
      }
    });
  }

  _openCart() {
    const cart = document.querySelector(this._cartSelector);
    document.body.classList.add("cart-open");
    cart.parentNode.classList.add("infront");
    var styleWithATCDrawers = document.querySelectorAll(
      "[data-style-with-mobile-atc-drawer]"
    );
    console.log(styleWithATCDrawers);
    styleWithATCDrawers.forEach((drawer) => {
      console.log(drawer);
      drawer.classList.remove("show-mobile-atc");
    });
  }
}

export default CartUpdate;
