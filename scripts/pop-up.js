// Quickview feature

// When user clicks on image, pop-up appears showing larger version of the image (maybe with blurb under? and title of the plant)
// Create a function that does something when the user clicks on the image
// The function will create pop-up elements when event is triggered and append them to the doc
    
export const openPopUp = ((event) => {
  const smolImage = event.target
  const parent = smolImage.parentNode
  // create wrapper element (darkens screen around pop-up box)
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  const title = parent.querySelector('h3').cloneNode(true)
  const price = parent.querySelector('p').cloneNode(true)
  const bigImage = parent.querySelector('img').cloneNode()
  const closeButton = document.createElement('button')


  // give the wrapper an id
  wrapper.id = 'pop-up'
  // give closeButton a class 
  closeButton.classList.add('close');
  closeButton.textContent = "Close"

  // create closePopUp function inside scope because wrapper is defined here
  const closePopUp = ((event) => {
    document.body.removeChild(wrapper)
  })
  // add an event listener to closeButton
  closeButton.addEventListener('click', closePopUp)

  // append elements to body of HTML
  wrapper.appendChild(closeButton)
  wrapper.appendChild(content)
  content.appendChild(title)
  content.appendChild(bigImage)
  content.appendChild(price)
  // append wrapper to body of html
  document.body.appendChild(wrapper)
  // make click handler for exit button, gets rid wrapper from doc 
})