import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { validate } from "uuid";
import { sendPacket } from "../../../logic/signal";
import sendIcon from "../../../media/send.svg";
import IconButton from "../../IconButton";
import "./Chat.scss";

const Chat = ({ children, userId }) => {
  const [messages, setMessages] = useState();
  const users = useSelector(state => state.social.users);
  const privateKey = useSelector(state => state.social.publicKey);
  const packets = useSelector(state => state.social.packets);

  useEffect(() => {
    if (userId && validate(userId) && packets) {
      setMessages(Object.keys(packets)
        .map(packetId => packets[packetId])
        .filter(packet => packet.userId === userId)
        .sort((a, b) => (a.date <= b.date) ? 1 : -1));
    }
    return () => {
      setMessages([]);
    }
  }, [packets, userId]);

  return (
    <>
      {privateKey
        ? <div className="Chat">
          {children}
          {userId && validate(userId) && users[userId] &&
            <h3>{users[userId].username}</h3>
          }
          <div className="Messages">
            {messages &&
              <>
                {
                  messages.map(packet => <Message key={packet.packetId} sender={packet.sender} message={packet.message} date={packet.date} />)
                }
              </>
            }
          </div>
          {userId && validate(userId) &&
            <MessageField userId={userId} />
          }
        </div>
        : <Redirect to="/chat/authenticate" />
      }
    </>
  );
}

Chat.propTypes = {
  userId: PropTypes.string
}

const Message = ({ sender, message, date }) => {
  return (
    <div className={`Message ${sender ? "sent" : "received"}`}>
      <span>{message}</span>
      <div className="Date">
        <p>{new Date(date).toLocaleString()}</p>
      </div>
    </div>
  );
}

Message.propTypes = {
  sender: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired
}

const MessageField = ({ userId }) => {
  const messageField = useRef();

  const onKeyPress = (event) => {
    if (event.key === "Enter" && messageField.current.value) {
      sendPacket(messageField.current.value, userId);
      messageField.current.value = "";
    }
  }

  const sendMessage = () => {
    if (messageField.current.value) {
      sendPacket(messageField.current.value, userId);
      messageField.current.value = "";
    }
  }

  return (
    <div className="MessageField">
      <input ref={messageField} aria-label="Message" placeholder="Message..." type="text" onKeyPress={onKeyPress} />
      <IconButton buttonName="Send" imageAlt="Send Icon" imageSource={sendIcon} onClick={sendMessage} />
    </div>
  );
}

MessageField.propTypes = {
  userId: PropTypes.string.isRequired
}

export default Chat;
