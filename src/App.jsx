import { useMemo, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("connection", () => {
      console.log("---- Coonnected ----");
    });

    socket.on("recMsg", (resMsg) => {
      console.log("---- Incoming Message ----", resMsg);
    });

    return () => {
      socket.off();
    };
  }, []);

  const handleMessage = (event) => {
    event.preventDefault();
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <>
      <form onSubmit={handleMessage}>
        <div className="flex flex-col justify-center items-center gap-5">
          <input
            style={{ border: "1px solid #222" }}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </>
  );
}

export default App;
