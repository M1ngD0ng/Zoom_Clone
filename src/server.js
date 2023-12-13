import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));

app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app); // views, static files, home, redirection을 사용하려고 http 서버를 만든 것
// 두 서버를 한 포트(3000)에 두려고 이런식으로 만드는 것. ws만 사용해도 됨
//const wss = new WebSocket.Server({ server }); // 이렇게하면 http, websocket서버를 둘 다 돌릴 수 있음
// http 위에 웹소켓을 놓은것
const wsServer=SocketIO(httpServer);
wsServer.on("connection",socket =>{
  socket.onAny((event)=>{
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName,done)=>{ 
    socket.join(roomName); 
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", ()=>{
    socket.rooms.forEach(room => socket.to(room).emit("bye"));
  });
  socket.on("new_message", (msg,room,done)=>{
    socket.to(room).emit("new_message",msg);
    done();
  });
});

/*
function handleConnection(socket){ // server.js의 socket은 연결된 브라우저를 의미함
  console.log(socket);
}  // 이런 방식은 바닐라js에서나 쓰는 것...
wss.on("connection",handleConnection); 
*/

function onSocketClose() {
  console.log("Disconnected from the Browser❌")
}
/*
const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose);
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => {
          if (aSocket["nickname"]!==socket.nickname)
            aSocket.send(`${socket.nickname}: ${message.payload}`);
        });
        break
      case "nickname":
        socket["nickname"] = message.payload;
      }
  });
});
*/
httpServer.listen(3000, handleListen);
