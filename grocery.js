const alert=document.querySelector('.alert')
const form=document.querySelector('.grocery-form')
const grocery=document.querySelector('#grocery')
const submitBtn=document.querySelector('.submit-btn')
const container=document.querySelector('.grocery-container')
const list=document.querySelector('.grocery-list')
const clearBtn=document.querySelector('.clear-btn')

// console.log(alert);
// console.log(form)
// console.log(grocery)
// console.log(submitBtn)
// console.log(container)
// console.log(list)
// console.log(clearBtn)

let editElement;
let editFlag=false;
let editId='';

form.addEventListener('submit',addItem);
clearBtn.addEventListener('click',clearItems);

//window.addEventListener('DOMContentLoaded', setupItems);
window.addEventListener("DOMContentLoaded",setupItems);
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();


    if (value && !editFlag){
       createListItem(id,value);
       displayAlert('item added','success');
       container.classList.add("show-container");
      addToLocalStorage(id,value);
      setBackToDefault();
     }
    else if (value && editFlag){
        editElement.innerHTML=value;
        displayAlert('value changed','success');
        editLocalstorage(editId,value);
        setBackToDefault();
        // console.log(editElement.innerHTML=value)
        
        }
    else {
      displayAlert("please enter value","danger")
    }
    
}
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id=element.dataset.id;
    list.removeChild(element)
    if(list.children.length === 0){
        container.classList.remove("show-container")
    }
    displayAlert('item removed','danger');
    removefromLocalStorage(id);
    setBackToDefault();


}
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement=e.currentTarget.parentElement.previousElementSibling;
  
//   console.log(element);
    grocery.value =editElement.innerHTML;
    editFlag=true;
    editId=element.dataset.id;
    submitBtn.textContent='edit';

}


function clearItems(){
    const items=document.querySelectorAll('.grocery-item');
    if(items.length>0){
        items.forEach(function(item){
            list.removeChild(item);
            console.log(list);
        })
    }
    container.classList.remove("show-container")
    displayAlert('empty list','danger');
    localStorage.removeItem('list');
    setBackToDefault();  
}

function addToLocalStorage(id,value){
    // console.log('added to local storage');
    const grocery ={id,value};
    // console.log(grocery)
    let items = getLocalStorage();
    
    items.push(grocery);
    localStorage.setItem('list',JSON.stringify(items));

}
function removefromLocalStorage(id){
    let items= getLocalStorage();
    items=items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    })
    localStorage.setItem('list',JSON.stringify(items));


}
function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];


}
function editLocalstorage(id,value){
    let items= getLocalStorage();
    items = items.map(function(item){
        if(item.id===id){
            item.value=value;
        }
        return item;
    })
    localStorage.setItem('list',JSON.stringify(items));   
}
// localStorage.setItem("orange",JSON.stringify(["item","item2"]))
// let orange = JSON.parse(localStorage.getItem("orange"));
// localStorage.removeItem("orange");
// console.log(orange)


function setBackToDefault(){
    grocery.value='';
    editFlag=false;
    editId='';
    submitBtn.textContent='submit';


    // console.log('set back to default')
}
function displayAlert(text,action){
    alert.textContent=text;
        alert.classList.add(`alert-${action}`)



        setTimeout(function () {
            alert.textContent='';
        alert.classList.remove(`alert-${action}`)
        
        },3000)
}
 function setupItems(){
     let items=getLocalStorage();
     if(items.length>0){
         items.forEach(function(item){
             createListItem(item.id,item.value)
         })
         container.classList.add("show-container");



     }
 }
 function createListItem(id,value){
    const element= document.createElement('article');
    element.classList.add('grocery-item');
    const attr = document.createAttribute('data-id');
    attr.value=id;
    element.setAttributeNode(attr);
    element.innerHTML = ` <p class="title">${value}</p>
    <div class="btn-container">
      <button class="edit-btn" type="button">
        <i class="fas fa-edit">

        </i>
      </button>
      <button class="delete-btn" type="button">
        <i class="fas fa-trash">
          
        </i>
      </button>
    </div>`;
    const deleteBtn= element.querySelector('.delete-btn');
    const editBtn= element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click',deleteItem);
    editBtn.addEventListener('click',editItem);


    list.appendChild(element);

 }