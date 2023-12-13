const socket = io(); // io function은 알아서 socket.io를 실행하고 있는 서버를 찾아옴

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");


function backendDone(msg) {
  console.log(`The backend says: `, msg);
}
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, backendDone); // "message"와 같이 정해진 event가 아니라, 이름 막 정해서 넘겨도 되는 custom event임
  input.value = ""; // (윗줄주석임) 프론트엔드에서 object를 전송할 수 있음
}
form.addEventListener("submit", handleRoomSubmit);