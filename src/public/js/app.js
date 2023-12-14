const socket = io(); // io function은 알아서 socket.io를 실행하고 있는 서버를 찾아옴  
const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("#create_room");
const nameForm = welcome.querySelector("#init_name");
const room = document.getElementById("room");
 
const editNameForm = welcome.querySelector("#edit_name");
 
room.hidden = true; 
editNameForm.hidden=true;

let roomName;
 
function addMessage(message){
  const ul=room.querySelector("ul");
  const li=document.createElement("li");
  li.innerText=message;
  li.style.listStyle="none";
  ul.appendChild(li);
} 
function editTitle(newCount){
  const h3= room.querySelector("h3");
  h3.innerText=`Room ${roomName} (${newCount})`;
}

function handleMessageSubmit(event){
  event.preventDefault();
  const input=room.querySelector("#msg input");
  const value=input.value;
  socket.emit("new_message",input.value, roomName, ()=>{
    const ul=room.querySelector("ul");
    const li=document.createElement("li");
    li.innerText=`You: ${value}`;
    li.style.textAlign="right";
    li.style.paddingRight="400px";
    li.style.listStyle="none";
    ul.appendChild(li);
  });
  input.value="";
}
function handleEditNickSubmit(event){
  event.preventDefault();
  const input=editNameForm.querySelector("input");
  const nick=input.value;
  socket.emit("nickname", nick);
  input.value="";

  const h4=editNameForm.querySelector("h4");
  h4.innerText=`Your current Nickname: ${nick}`;
}
editNameForm.addEventListener("submit", handleEditNickSubmit);

function handleInitNickSubmit(event){
  event.preventDefault();
  const input=nameForm.querySelector("input");
  const nick=input.value;
  socket.emit("nickname", nick);
  input.value="";
  nameForm.hidden = true;
  editNameForm.hidden= false;

  const h4=editNameForm.querySelector("h4");
  h4.innerText=`Your current Nickname: ${nick}`;
}
nameForm.addEventListener("submit", handleInitNickSubmit);

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  editTitle(1);
  const msgForm=room.querySelector("#msg"); 
  msgForm.addEventListener("submit", handleMessageSubmit);
}
function handleNewRoomSubmit(event) {
  event.preventDefault();
  const input = roomForm.querySelector("input");
  socket.emit("create_room", input.value, showRoom);
  roomName=input.value;
  input.value = "";
}
roomForm.addEventListener("submit", handleNewRoomSubmit);


socket.on("welcome", (user, newCount)=>{
  editTitle(newCount);
  addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount)=>{
  editTitle(newCount);
  addMessage(`${left} left ㅠㅠ `);
});

socket.on("new_message", addMessage);

/*
socket.on("room_change", (rooms)=>{
  const roomList=welcome.querySelector("ul");
  roomList.innerHTML="";
  if(rooms.length===0){
    return;
  }
  rooms.forEach(room =>{
    const li =document.createElement("li");
    li.innerText=room;
    roomList.append(li);
  });
});*/

socket.on("room_change", (rooms)=>{

  const roomList=welcome.querySelector("ul");
  roomList.style.padding="0px";
  const h=document.createElement("h4");
  h.innerText="~ Room List ~";
  h.style.textAlign="center";
  roomList.innerHTML="";

  roomList.append(h);
  if(rooms.length===0){
    return;
  }
  rooms.forEach(room =>{
    const form=document.createElement("form");
    const div=document.createElement("div");
    const btn=document.createElement("button");

    div.innerText=room;
    btn.innerText="Enter Room";
    form.append(div);
    form.append(btn);
    roomList.append(form);
    form.addEventListener("submit", (event)=>{
      welcome.hidden = true;
      editNameForm.hidden = true;
      room.hidden = false;
      event.preventDefault();
      roomName=room
      socket.emit("enter_room", room, showRoom);

    });
  });
});
