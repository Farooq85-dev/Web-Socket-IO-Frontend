import { useMemo, useState, useEffect } from "react";
import { Card, Input, Button, ChatBubble, Alert, Toast } from "react-daisyui";
import { io } from "socket.io-client";
import { VscSend } from "react-icons/vsc";

function App() {
  const socket = useMemo(
    () => io("https://web-socket-io-backend.vercel.app"),
    []
  );
  const [message, setMessage] = useState("");
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [outgoingMessages, setOutgoingMessages] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Listening for incoming messages
    socket.on("recMsg", (resMsg) => {
      console.log("---- Incoming Message ----", resMsg);
      setIncomingMessages((prevMessages) => [...prevMessages, resMsg]);
    });

    return () => {
      socket.off("recMsg");
    };
  }, [socket]);

  const handleMessage = (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      setShowToast(true); // Show toast if message is empty
      setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
      return;
    }
    setShowToast(false);
    socket.emit("message", message);
    setOutgoingMessages((prevMessages) => [...prevMessages, message]);
    console.log("---- Outgoing Message ----", message);
    setMessage("");
  };

  return (
    <div className="flex flex-col justify-center gap-10 items-center h-screen bg-[#2b3440] ">
      <h1 className="text-5xl text-[#fff] font-bold">Socket IO</h1>
      <form onSubmit={handleMessage}>
        <Card className="p-5 w-96 gap-6 bg-[#fff]">
          {incomingMessages.map((msg, i) => (
            <ChatBubble key={`incoming-${i}`}>
              <ChatBubble.Message>{msg}</ChatBubble.Message>
            </ChatBubble>
          ))}
          {outgoingMessages.map((msg, i) => (
            <ChatBubble end key={`outgoing-${i}`}>
              <ChatBubble.Message>{msg}</ChatBubble.Message>
            </ChatBubble>
          ))}
          <Card.Body className="p-0 items-start text-center">
            <Card.Actions className="w-full relative">
              <Input
                value={message}
                placeholder="Type here..."
                onChange={(e) => setMessage(e.target.value)}
                className="w-full pt-8 pb-8 text-2xl"
              />
              <Button
                type="submit"
                color="neutral"
                className="absolute right-3 cursor-pointer top-2"
              >
                <VscSend size={20} />
              </Button>
            </Card.Actions>
          </Card.Body>
        </Card>
      </form>
      {showToast && (
        <Toast vertical="top" horizontal="end">
          <Alert status="info">Please Type Something First...</Alert>
        </Toast>
      )}
    </div>
  );
}

export default App;
