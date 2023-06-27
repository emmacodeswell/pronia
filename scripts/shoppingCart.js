document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger")
  const menu = document.querySelector(".menu")
  const closeMenuButton = document.getElementById("closeMenu")

  hamburger.addEventListener("click", function () {
    menu.classList.toggle("open")
  });

  closeMenuButton.addEventListener("click", closingMenu)

  function closingMenu() {
    menu.classList.remove("open")
    console.log("menu closed")
  }
});
