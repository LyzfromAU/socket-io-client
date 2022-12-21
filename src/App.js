import "./app.scss";
import io from "socket.io-client";
import { useEffect, useState } from "react";

let socket; 
function App() {
  //Room State
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const joinRoom = () => {
    if (room !== "" && name !== "") {
      socket.emit("join_room", room);
      setJoined(true);
    } else {
      alert('Please enter your name and room you want to join!')
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { 
      message, 
      room,
      name
    });
    let array = messages;
    array.unshift({
      message, 
      name
    });
    setMessages([...array]);
  };
  
  useEffect(() => {
    socket = io.connect("http://192.168.0.62:3001");
    socket.on("receive_message", (data) => {
      let array = messages;
      array.unshift(data);
      setMessages([...array]);
    });
  }, []);
  return (
    <div className="App">
      {!joined ? <div className="viewport"><div className="join-form">
          <input type="text" placeholder="Name" value={name} onChange={(e) => {setName(e.target.value)}} />
          <input type="text" placeholder="Room number" value={room} onChange={(e) => {setRoom(e.target.value)}} />
          <button onClick={joinRoom}>Start Game</button>
        </div></div> : null}
      
      {joined ? <div className="main">
        <div className="messages">
          {messages.map((m, i) => {
            return (<div className={m.name === name ? "my-message" : "others-message"} key={i + m.message}>
              <div className="title">{m.name}</div>
              <div className="content">{m.message}</div>
            </div>)
          })}

        </div>
        <div className="send">
          <input
            placeholder="Message..."
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        
      </div> : null}
    </div>
  );
}

export default App;
