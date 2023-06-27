import { app } from "./firebase.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// == Setup Code ==
const database = getDatabase(app);
const dbRef = ref(database);

// == GLOBAL SCOPE ==
const products = document.querySelector(".products");

// Was the 'add to cart' button clicked?
const updateDatabase = (event, value) => {
  const id = `p${event.currentTarget.id}`;
  const childRef = ref(database, `/plants/${id}`);
  update(childRef, { inCart: value });
};

// Get user cart data
onValue(dbRef, (data) => {
  
  if (data.exists()) {
    const payload = data.val().plants;
    const allProducts = Object.values(payload);

    // products in cart / inCart === true
    const addToCart = allProducts.filter((plant) => {
      return plant.inCart === true;
    });

    // TODO: write code here that will make inCart === true display in the cart pop-out feature
    displayPlants(allProducts, products);
    // displayPlants(addToCart, cart)
  } else {
    console.log("No data to report!");
  }
});

// Display plant photos and make add to cart button
const displayPlants = (arrayOfPlants, node) => {
  node.innerHTML = "";
  arrayOfPlants.forEach((plant) => {
    const div = document.createElement("div");
    div.classList.add("plant");
    const img = document.createElement("img");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    p.classList.add("greenInfo");
    const button = document.createElement("button");
    const buttonImg = document.createElement("img");

    button.id = plant.id;
    buttonImg.src = "./assets/icons/cart.svg";

    // // Listen for adding to cart

    button.addEventListener("click", function (event) {
      const plantId = event.target.parentNode.id;
      const plant = plants.find((item) => item.id === plantId);

      if (plant) {
        addItem(plant.name, plant.price);
        displayItem(plant.src, plant.name);
      }
    });

    // Listen for adding to cart
    button.addEventListener('click', function(event){
      updateDatabase(event, plant.inCart+1)
      console.log("clicked yes")

      addToDiv(plant)
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

let cart = [];
let total = 0;

function addItem(name, price) {
  let item = {
    name: name,
    price: price,
    quantity: 1,
  };

  //check if item is already in cart

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].quantity++;
      updateCart();
      return;
    }
  }

  //if item isnt in the cart, add it!
  cart.push(item);
  updateCart();
}

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
    img.src = plants.find((plant) => plant.name === item.name).src;
    img.alt = item.name;
    li.appendChild(img);

    let span = document.createElement("span");
    span.textContent = `${item.name} - $${item.price} x ${item.quantity} = $${itemTotal}`;

    // subtract button
    let subtractBtn = document.createElement("button");
    subtractBtn.classList.add("subtract-btn");

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
      subtractItem(item.name);
    });

    // addition button
    let additionBtn = document.createElement("button");
    additionBtn.classList.add("addition-btn");

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
      addItem(item.name, item.price);
    });

    li.appendChild(span);
    li.appendChild(subtractBtn);
    li.appendChild(additionBtn);
    cartItems.appendChild(li);

  }

  function subtractItem(name) {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].name === name) {
        cart[i].quantity--;

        if (cart[i].quantity === 0) {
          cart.splice(i, 1);
        }

        updateCart();
        return;
      }
    }
  }

  document.getElementById("cart-total").textContent = total;
}

function toggleCart() {
  let cart = document.getElementById("cart");
  cart.classList.toggle("open");
}

function checkout() {
  //save cart data (add soonish pls ty)
}

//displayPlants + array and firebase stuff//

//haha lol array!!!! wow!!

const plants = [
  {
    name: "American Marigold",
    id: "1",
    category: "featured",
    price: 23.45,
    src: "./assets/p2.jpeg",
    alt: "A Marigold plant",
    inCart: 0,
  },
  {
    name: "Black Eyed Susan",
    id: "2",
    category: "featured",
    price: 25.45,
    src: "./assets/p1.jpeg",
    alt: "A Black Eyed Susan plant",
    inCart: 0,
  },
  {
    name: "Bleeding Heart",
    id: "3",
    category: "featured",
    price: 30.45,
    src: "./assets/p3.jpeg",
    alt: "A Bleeding Heart plant",
    inCart: 0,
  },
  {
    name: "Bloody Cranesbill",
    id: "4",
    category: "bestseller",
    price: 45.0,
    src: "./assets/p4.jpeg",
    alt: "A Bloody Cranesbill plant",
    inCart: 0,
  },
  {
    name: "Butterfly Weed",
    id: "5",
    category: "bestseller",
    price: 50.45,
    src: "./assets/p5.jpeg",
    alt: "A Butterfly Weed plant",
    inCart: 0,
  },
  {
    name: "Common Yarrow",
    id: "6",
    category: "bestseller",
    price: 65.0,
    src: "./assets/p6.jpeg",
    alt: "A Common Yarrow ",
    inCart: 0,
  },
  {
    name: "Doublefile Viburnum",
    id: "7",
    category: "latest",
    price: 67.45,
    src: "./assets/p7.jpeg",
    alt: "A Doublefile Viburnum plant",
    inCart: 0,
  },
  {
    name: "Feather Reed Grass",
    id: "8",
    category: "latest",
    price: 20.0,
    src: "./assets/p8.jpeg",
    alt: "A Feather Reed Grass plant",
    inCart: 0,
  },
];

//lol array lmao teehee//

const containerNode = document.getElementById("plants-container");
displayPlants(plants, containerNode);

const checkoutButton = document.getElementById("checkout-button");
checkoutButton.addEventListener("click", checkout);

