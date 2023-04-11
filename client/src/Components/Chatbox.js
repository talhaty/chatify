import React, { useEffect, useState } from "react";
import "./Chatbox.css";
import ChatInput from "./ChatInput";
import Message from "./Message";

const messages = [];

function Chatbox(props) {
  const [credits, setCredits] = useState(3);
  const [message, setMessage] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await fetch(`/verify/${props.user.username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCredits(data.user.requests);
        }
      } catch (error) {
        console.log(error);
      }
    };

    authenticate();
  }, []);

  const GPTResponse = async (event) => {
    try {
      event.preventDefault();
      messages.push({ role: "user", content: text });
      const res = await fetch(`/chatgpt`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          msg: messages,
          username: props.user.username,
        }),
      });
      const data = await res.json();
      if (data.status === "1200") {
        messages.push({
          role: "assistant",
          content: "You have 0 Requests left for today",
        });
        setMessage(data.message);
      } else {
        console.log(data.choices[0].message.content);
        messages.push({
          role: "assistant",
          content: data.choices[0].message.content,
        });
        setMessage(data.choices[0].message.content);
        setCredits(data.requests);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div id="mainContainer">
        <div id="chatContainer">
          {messages.map((msg) => {
            return <Message text={msg["content"]} sender={msg["role"]} />;
          })}
        </div>
        <div id="inputContainer">
          <div id="bar"></div>
          <p>
            Credits Left : <p>{credits}</p>
          </p>
          <form id="chatInput" onSubmit={GPTResponse}>
            <input
              tye="text"
              placeholder="Enter something...."
              onChange={(event) => setText(event.target.value)}
            />
            <button>Ask Me</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chatbox;
