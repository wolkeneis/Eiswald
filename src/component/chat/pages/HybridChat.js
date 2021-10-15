import PropTypes from "prop-types";
import Chat from "./Chat";
import ChatOverview from "./ChatOverview";
import "./HybridChat.scss";
import PrivateKey from "./PrivateKey";

const HybridChat = ({ userId }) => {
  return (
    <>
      <div className="HybridChat">
        {userId !== "authenticate"
          ? <>
            < div className="ChatOverview">
              <ChatOverview />
            </div>
            <Chat userId={userId} />
          </>
          : <PrivateKey />
        }
      </div>
    </>
  );
}

Chat.propTypes = {
  userId: PropTypes.string
}

export default HybridChat;
