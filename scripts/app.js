import { app } from './firebase.js'
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js"
import { openPopUp } from './pop-up.js'

// == Setup Code ==
const database = getDatabase(app);
const dbRef = ref(database);

// == GLOBAL SCOPE ==
const products = document.querySelector(".products");
const hamburger = document.querySelector('.hamburger')
let cart = [];
let total = 0;

// Was the 'add to cart' button clicked?
const updateDatabase = (event, value) => {
  const id = `p${event.currentTarget.getAttribute('plantId')}`;
  const childRef = ref(database, `/plants/${id}`);
  update(childRef, { inCart: value });
};

// Get user cart data
onValue(dbRef, (data) => {
  
  if (data.exists()) {
    const payload = data.val().plants;
    const allProducts = Object.values(payload);
    cart = allProducts.filter(item => item.inCart).map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.inCart,
      id: item.id,
      src: item.src,
      alt: item.alt
    }))
    updateCart()

    // products in cart / inCart === true
    const itemsInCart = allProducts.filter(plant => plant.inCart)
    
    // TODO: write code here that will make inCart === true display in the cart pop-out feature
    displayPlants(allProducts, products)
    displayCart(itemsInCart, hamburger)

  } else {
    console.log("No data to report!");
  }
});

/**
 * Displays a notification on top of image, at given node
 * @param node - the node inside which the notification gets rendered
 * @param text - what text gets rendered
 */
const displayNotification = (node, text) => {
  const className = 'notification'
  let notification = node.querySelector(`.${className}`)

  if (!notification) {
    notification = document.createElement('p')
    notification.classList.add(className)
    notification.textContent = text
    node.append(notification)
  }
}

// Display plant photos and make add to cart button
const displayPlants = (arrayOfPlants, node) => {
  if (!node) return

  node.innerHTML = "";
  arrayOfPlants.forEach((plant) => {
    const div = document.createElement("div");
    div.classList.add("plant");
    const img = document.createElement("img");

    // Add event listener to img and call openPopUp function
    img.addEventListener('click', openPopUp)

    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    p.classList.add("greenInfo");
    const button = document.createElement("button");
    const buttonImg = document.createElement("img");

    button.setAttribute('plantId', plant.id);
    buttonImg.src = "./assets/icons/cart.svg";

    // Listen for adding to cart
    button.addEventListener('click', function(event){
      updateDatabase(event, plant.inCart+1)
      displayNotification(div, "Smack my ass like a drum")
    })

    h3.textContent = plant.name;
    img.alt = plant.alt;
    img.src = plant.src;
    p.textContent = `$${plant.price.toFixed(2)}`;
    div.append(img);
    button.append(buttonImg);
    div.append(button);
    div.append(h3);
    div.append(p);
    node.append(div);
  });
};

// S H O P P I N G  C A R T  U W U

function updateCart() {
  let cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  total = 0;

  for (let i = 0; i < cart.length; i++) {
    let item = cart[i];
    let itemTotal = item.price * item.quantity;

    total += itemTotal;

    let li = document.createElement("li");
    li.classList.add("cart-item");

    let img = document.createElement("img");
    img.src = item.src
    img.alt = item.name;
    li.appendChild(img);

    let span = document.createElement("span");
    span.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}`;

    // subtract button
    let subtractBtn = document.createElement("button");
    subtractBtn.classList.add("subtract-btn");
    subtractBtn.setAttribute('plantId', item.id)

    // subtract button icon
    let subtractBtnImg = document.createElement("img");
    subtractBtnImg.src = "./assets/icons/minus-solid.svg";
    subtractBtnImg.alt = "subtract-item";
    subtractBtnImg.style.width = "12px";
    subtractBtnImg.style.height = "12px";
    subtractBtn.style.marginLeft = "8px"

    subtractBtn.appendChild(subtractBtnImg);

    subtractBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      updateDatabase(event, item.quantity-1);
    });

    // addition button
    let additionBtn = document.createElement("button");
    additionBtn.classList.add("addition-btn");
    additionBtn.setAttribute('plantId', item.id)

    // addition button icon
    let additionBtnImg = document.createElement("img");
    additionBtnImg.src = "./assets/icons/plus-solid.svg";
    additionBtnImg.alt = "add-item";
    additionBtnImg.style.width = "12px";
    additionBtnImg.style.height = "12px";
    additionBtn.style.marginLeft = "8px"


    additionBtn.appendChild(additionBtnImg);

    additionBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      updateDatabase(event, item.quantity+1)
    });

    li.appendChild(span);
    li.appendChild(subtractBtn);
    li.appendChild(additionBtn);
    cartItems.appendChild(li);
  }

  document.getElementById("cart-total").textContent = total.toFixed(2);
}

function toggleCart() {
  let cart = document.getElementById("cart");
  cart.classList.toggle("open");
}

function checkout() {
  const plantRef = ref(database, "/plants")
  const emptyCartData = cart.reduce((obj, item) => {
    obj[`p${item.id}/inCart`] = 0
    return obj
  }, {})
  update(plantRef, emptyCartData)
}

const checkoutButton = document.getElementById("checkout-button");
checkoutButton.addEventListener("click", checkout);

const displayCart = (itemsInCart, node) => {
  const itemsIconId = 'numItems'
  let itemsIcon = node.querySelector(`#${itemsIconId}`)
  // shorthand for a function with one argument that returns a value, tells us which items are in our cart
  const numItemsInCart = itemsInCart.reduce((sum, item) => {
    return sum + item.inCart
  }, 0)

  // conditional statement for when there is no item icon AND items in cart
  if (!itemsIcon && numItemsInCart) {
    itemsIcon = document.createElement('span')
    itemsIcon.id = itemsIconId
    itemsIcon.textContent = numItemsInCart
    node.append(itemsIcon)
  }
  if (itemsIcon && numItemsInCart) {
    itemsIcon.textContent = numItemsInCart
  }
  // conditional statement for when there are no items in cart and num icon
  if (!numItemsInCart && itemsIcon) {
    node.removeChild(itemsIcon)
  }
}