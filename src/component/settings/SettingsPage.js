import PropTypes from "prop-types";
import { useHistory } from "react-router";
import "./SettingsPage.scss";

const SettingsPage = ({ children, mobile, style }) => {
  const history = useHistory();

  return (
    <>
      {
        <div style={style} className={mobile ? "NativeSettingsPage" : "SettingsPage"}>
          <CloseButton onClick={() => history.push("/")} />
          {children}
        </div>
      }
    </>
  );
};

SettingsPage.defaultProps = {
  open: false
}

SettingsPage.propTypes = {
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


const NativeSettingsPage = ({ children, style }) => {
  return (
    <div style={style} className="NativeSettingsPage">
      {children}
    </div>
  );
};

NativeSettingsPage.propTypes = {
  style: PropTypes.object
}

export default SettingsPage;
export { NativeSettingsPage };

