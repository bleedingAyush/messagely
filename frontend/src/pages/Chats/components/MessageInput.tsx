import React, { useRef, useState } from "react";
import { ReactComponent as Send } from "../../../assets/send.svg";
import "../styles/MessageInput.scss";
import useSendChat from "../hooks/useSendChat";

const MessageInput = () => {
  const sendMessageBtnRef = useRef<HTMLButtonElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const sendChat = useSendChat();

  const handleSendChat = () => {
    if (message.length == 0) return;

    sendChat(message);
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == "Enter") {
      sendMessageBtnRef?.current?.click();
    }
  };

  return (
    <div className="send-message-container">
      <input
        id="messageInput"
        value={message}
        placeholder="Send Message..."
        type="text"
        onChange={changeMessage}
        ref={messageInputRef}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSendChat}
        className="send-chat-btn"
        ref={sendMessageBtnRef}
      >
        <Send />
      </button>
    </div>
  );
};

export default MessageInput;
