import { app } from './firebase.js'
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js"

// == Setup Code ==
const database = getDatabase(app)
const dbRef = ref(database)

// == GLOBAL SCOPE ==
const products = document.querySelector('.products')


// Was the 'add to cart' button clicked?
const updateDatabase = (event, value) => {
  const id = `p${event.currentTarget.id}`
  const childRef = ref(database, `/plants/${id}`)
  update(childRef, {inCart: value})
}

// Get user cart data
onValue(dbRef, (data) => {
  
  if(data.exists()){
    const payload = data.val().plants
    const allProducts = Object.values(payload)

    // products in cart / inCart === true
    const addToCart = allProducts.filter((plant) => {
      return plant.inCart === true
    });
    
    // TODO: write code here that will make inCart === true display in the cart pop-out feature
    displayPlants(allProducts, products)
    // displayPlants(addToCart, cart)
  } else {
    console.log('No data to report!')
  }
});


// Display animal photos and make add to cart button
const displayPlants = (arrayOfPlants, node) => {
  node.innerHTML = ''
  arrayOfPlants.forEach((plant) => {
    const div = document.createElement('div')
    div.classList.add('plant')
    const img = document.createElement('img')
    const h3 = document.createElement('h3')
    const p = document.createElement('p')
    p.classList.add('greenInfo')
    const button = document.createElement('button')
    const buttonImg = document.createElement('img')
    
    button.id = plant.id
    buttonImg.src = "./assets/icons/cart.svg"
    // Listen for adding to cart
    button.addEventListener('click', function(event){
      updateDatabase(event, plant.inCart+1)
    })
    
    h3.textContent = plant.name
    img.alt = plant.alt
    img.src = plant.src
    p.textContent = `$${plant.price.toFixed(2)}`
    div.append(img);
    button.append(buttonImg)
    div.append(button);
    div.append(h3);
    div.append(p)
    node.append(div);
  });
}