var uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn");
const modalcont = document.querySelector(".modal-cont");
const allPriorityColors = document.querySelectorAll(".priority-color");
let colors = ["lightpink","lightgreen","lightblue","black"];
let modalPriorityColor = colors[colors.length-1]; //black
let textAreaCont = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
let ticketsArr = [];
let toolBoxColors = document.querySelectorAll(".color");
let removeBtn = document.querySelector(".remove-btn");
// font awsome website;
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
//to open close modal container

let isModalPresent = false;
addBtn.addEventListener("click",function(){
  if(!isModalPresent){
    modalcont.style.display = "flex"; // modal add ho gaya screen par
    //isModalPresent = true;
  }else{
    modalcont.style.display = "none";
  }
  isModalPresent = !isModalPresent; //toggling effect
});

// console.log(allPriorityColors);

//to remove and add active class from each priority color of modal cont
allPriorityColors.forEach(function(colorElement){
  colorElement.addEventListener("click",function(){
    allPriorityColors.forEach(function(priorityColorElem){
      priorityColorElem.classList.remove("active");
    })
    colorElement.classList.add("active");
    modalPriorityColor = colorElement.classList[0];
  });
});

//to generate and display a ticket
modalcont.addEventListener("keydown",function(e){
let key = e.key;
if(key == "Shift"){
  console.log(modalPriorityColor);
  console.log(textAreaCont.value);
  createTicket(modalPriorityColor,textAreaCont.value);
  modalcont.style.display = "none";
  isModalPresent = false;
  textAreaCont.value = "";
  allPriorityColors.forEach(function(colorElem){
    colorElem.classList.remove("active");
  });
}
});

//function to create new tickets
function createTicket(ticketColor,data,ticketId){
  let id = ticketId || uid();
  let ticketCont = document.createElement("div"); //<div> </div>
  ticketCont.setAttribute("class","ticket-cont");
  ticketCont.innerHTML = `
  <div class="ticket-color ${ticketColor} "></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${data}</div>
        <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
        </div>
  `;
 mainCont.appendChild(ticketCont);

 handleRemoval(ticketCont,id);
 handleColor(ticketCont,id);
 handleLock(ticketCont,id);
 //if ticket is created for first time, then ticketId would be undefined
 if(!ticketId){
  ticketsArr.push(
    {
      ticketColor,
      data,
      tickedId: id
    }
  );
  localStorage.setItem("tickets",JSON.stringify(ticketsArr));
 }
};

//get all tickets from local storage
if(localStorage.getItem("tickets")){
  ticketsArr = JSON.parse(localStorage.getItem("tickets"));
  ticketsArr.forEach(function(ticketObj){
    createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);

  })
  
}

//filter ticket on basis of ticket color
for(let i = 0;i < toolBoxColors.length;i++){
  toolBoxColors[i].addEventListener("click",function() {
    let currToolBoxColor = toolBoxColors[i].classList[0];

    let filterTickets = ticketsArr.filter(function (ticketObj){
    if(currToolBoxColor==ticketObj.ticketColor) return ticketObj;
    });

    //remove all the tickets
    let allTickets = document.querySelector(".ticket-cont");
    for(let i = 0; i < allTickets.length;i++){
      allTickets[i].remove();
    }
    //display filter tickets

    filterTickets.forEach(function(ticketObj){
      createTicket(
        ticketObj.ticketColor,
        ticketObj.data,
        ticketObj.tickedId
      );
    })
   

  })
  //to display all the Tickets of all colors on double clicking
  toolBoxColors[i].addEventListener("dblclick",function(){

    //remove all the color specific tickets
   let allTickets = document.querySelectorAll(".ticket-cont");
   for(let i = 0;i < allTickets.length;i++){
    allTickets[i].remove();
   }

   //display all tickets
   ticketsArr.forEach(function(ticketObj){
    createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
   });
  })
  
};
//on clicking removeBtn, make color red and make color white in clicking again
let removeBtnActive = false;
removeBtn.addEventListener("click",function(){
  if(removeBtnActive){
    removeBtn.style.color = "white";
  }
  else{
    removeBtn.style.color = "red";
  }
  removeBtnActive = !removeBtnActive;
});

//remove ticket from local storage and UI
function handleRemoval(ticket, id){
ticket.addEventListener("click",function(){
if(!removeBtnActive) return;
//local storage remove
//-> get idx of the ticketsto be deleted
let idx = getTicketIdx(id);
ticketsArr.splice(idx,1);

//remove from browser storage and set updated arr
localStorage.setItem("tickets",JSON.stringify(ticketsArr));

//frontend remove
ticket.remove();
});
}

//return index of the ticket inside local storage's array
function getTicketIdx(id){
  let ticketIdx= ticketsArr.findIndex(function(ticketObj){
  return ticketObj.ticketId == id;
  })
  return ticketIdx;
}

//change priority color of the tickets
function handleColor(ticket,id){
  let ticketColorStrip = ticket.querySelector(".ticket-color");

  ticketColorStrip.addEventListener("click",function(){
    let currTicketColor = ticketColorStrip.classList[1];//lightPink
    //["lightpink", "lightgreen", "lightblue", "black"];
   let currTicketColorIdx = colors.indexOf(currTicketColor);

   let newTicketColorIdx = currTicketColorIdx + 1; //1

   newTicketColorIdx = newTicketColorIdx % colors.length; //1
   let newTicketColor = colors[newTicketColorIdx] //lightgreen

   ticketColorStrip.classList.remove(currTicketColor); //lightpink [ticket-color, lightpink]-> [ticket-color]
   ticketColorStrip.classList.add(newTicketColor);
    
   //local storage update
  let ticketIdx = getTicketIdx(id);
  ticketsArr[ticketIdx].ticketColor = newTicketColor;
  localStorage.setItem("tickets",JSON.stringify(ticketsArr));

  });
}

//lock and unlock to make content editable true and false
function handleLock(ticket,id) {
  //icons ko append in ticket

  let ticketLockEle = ticket.querySelector(".ticket-lock");
  let ticketLock = ticketLockEle.children[0];
  let ticketTaskArea = ticket.querySelector(".task-area");
  //console.log(ticketLock);


  ticketLock.addEventListener("click", function(){
    let ticketIdx = getTicketIdx(id);
    if(ticketLock.classList.contains(lockClass)) {
      ticketLock.classList.remove(lockClass);
      ticketLock.classList.add(unlockClass);
      ticketTaskArea.setAttribute("contenteditable","true");
    }
    else{
       //if lock is open
       ticketLock.classList.remove(unlockClass);
       ticketLock.classList.add(lockClass);
       ticketTaskArea.setAttributes("contenteditable,false");
    } 
    ticketsArr[ticketIdx].data = ticketTaskArea.innerText;
    localStorage.setItem("tickets",JSON.stringify(ticketsArr));
  });
}







