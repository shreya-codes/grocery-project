const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const quantity = document.getElementById("quantity");
const price= document.getElementById("price");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
const TotalBtn = document.querySelector(".total-btn");
const amount = document.getElementById('totalamount');
// edit option
// console.log(list);
// list.forEach()
TotalBtn.addEventListener("click", calculate);

function calculate(){
    let items = getLocalStorage();
    if (items.length > 0) {
    var subtotal;
    var total=0;
        items.forEach(function (item) {
            subtotal = item.quantityitem*item.priceitem;
            total=total+subtotal;
        //   createListItem(item.id, item.value,item.quantityitem,item.priceitem);
        });
        // console.log(amount);
        amount.innerHTML=`RS ${total}`;
        container.classList.add("show-container");
        setBackToDefault();
      }

}
let editElement;
let editElementQuantity;
let editElementPrice;
let editFlag = false;
let editID = "";
// ****** event listeners **********

// submit form
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);

// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const quantityitem=quantity.value;
  const priceitem=price.value
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag && quantityitem !== "" &&priceitem !== "" ) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value} </p> <p class="quantity-value">${quantityitem}</p><p class="item-price"> RS  ${priceitem}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // append child
    list.appendChild(element);
    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, value,quantityitem,priceitem);
    // set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag && quantityitem !== "" &&priceitem !== "") {
    editElement.innerHTML = value;
    editElementQuantity.innerHTML=quantityitem;
    editElementPrice.innerHTML=priceitem ;

    displayAlert("value changed", "success");

    // edit  local storage
    editLocalStorage(editID, value,quantityitem,priceitem);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
 
}
function editLocalStorage(id, value,quantityitem,priceitem) {
    let items = getLocalStorage();
  
    items = items.map(function (item) {
      if (item.id === id) {
        item.value = value;
        console.log(item.value)
        item.quantityitem=quantityitem;
        console.log(item.quantityitem)

        item.priceitem=priceitem;
        console.log(item.priceitem)

      }
      return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
  }
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// delete item

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  console.log(element)
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
//   console.log(element)
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
  editElementQuantity = e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
  editElementPrice = e.currentTarget.parentElement.previousElementSibling;

//   console.log(editElement)
//   console.log(editElementQuantity)
//   console.log(editElementPrice)
  // set form value
  grocery.value = editElement.innerHTML;
  price.value= parseFloat(editElementPrice.innerHTML);
  quantity.value=parseInt(editElementQuantity.innerHTML)  
  editFlag = true;
  editID = element.dataset.id;
  //
  submitBtn.textContent = "edit";
}
// set backt to defaults
function setBackToDefault() {
  grocery.value = "";
  quantity.value ="";
  price.value ="";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, value,quantityitem,priceitem) {
  const grocery = { id, value,quantityitem,priceitem };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  console.log(items)

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

function setupItems() {
  let items = getLocalStorage();


  if (items.length > 0) {
    items.forEach(function (item) {
        // console.log(item.quantityitem)
      createListItem(item.id, item.value,item.quantityitem,item.priceitem);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value,quantityitem,priceitem) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value} </p> <p class="quantity-value">${quantityitem}</p><p class="item-price"> RS ${priceitem}</p>
  <div class="btn-container">
    <!-- edit btn -->
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <!-- delete btn -->
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>
`;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // append child
  list.appendChild(element);
}

