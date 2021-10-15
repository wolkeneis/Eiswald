import PropTypes from "prop-types";
import { useHistory } from "react-router";
import "./ChatPage.scss";

const ChatPage = ({ children, mobile, style }) => {
  const history = useHistory();

  return (
    <>
      {
        <div style={style} className={mobile ? "NativeChatPage" : "ChatPage"}>
          <CloseButton onClick={() => history.push("/")} />
          {children}
        </div>
      }
    </>
  );
};

ChatPage.defaultProps = {
  open: false
}

ChatPage.propTypes = {
  mobile: PropTypes.bool,
  style: PropTypes.object
}

const CloseButton = ({ onClick }) => {
  return (
    <button aria-label="Close Settings" className="CloseButton" onClick={onClick}>×</button>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
}


const NativeChatPage = ({ children, style }) => {
  return (
    <div style={style} className="NativeChatPage">
      {children}
    </div>
  );
};

NativeChatPage.propTypes = {
  style: PropTypes.object
}

export default ChatPage;
export { NativeChatPage };

