import "./styles/ChatInbox.scss";
import MessageComponent from "./components/MessageComponent";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";

const ChatInbox = () => {
  return (
    <div className="chatbox-container">
      <ChatHeader />
      <MessageComponent />
      <MessageInput />
    </div>
  );
};

export default ChatInbox;
