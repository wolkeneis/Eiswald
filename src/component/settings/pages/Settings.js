import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import contactIcon from "../../../media/contacts.svg";
import developerIcon from "../../../media/developer.svg";
import moonIcon from "../../../media/moon.svg";
import nodesIcon from "../../../media/nodes.svg";
import profileIcon from "../../../media/profile.svg";
import sunIcon from "../../../media/sun.svg";
import { toggleTheme } from "../../../redux/interfaceSlice";
import "./Settings.scss";

const Settings = () => {
  const theme = useSelector(state => state.interface.theme);
  const dispatch = useDispatch();

  return (
    <>
      <h1>Settings</h1>
      <SettingsLinkItem linkName="Account Settings" imageAlt="Account Icon" imageSource={profileIcon} destination="/settings/profile">
        <span>Profile</span>
      </SettingsLinkItem>
      <SettingsLinkItem linkName="Node Settings" imageAlt="Node Connections" imageSource={nodesIcon} destination="/settings/nodes">
        <span>Nodes</span>
      </SettingsLinkItem>
      <SettingsLinkItem linkName="Contact Settings" imageAlt="Contact icon" imageSource={contactIcon} destination="/settings/contacts">
        <span>Contacts</span>
      </SettingsLinkItem>
      <SettingsLinkItem linkName="Developer Settings" imageAlt="Developer Icon" imageSource={developerIcon} destination="/settings/developer">
        <span>Developer Settings</span>
      </SettingsLinkItem>
      <SettingsButtonItem
        buttonName="Theme Toggler"
        imageAlt={theme === "dark-theme" ? "Sun Icon" : "Moon Icon"}
        imageSource={theme === "dark-theme" ? sunIcon : moonIcon}
        onClick={() => dispatch(toggleTheme())}>
        <span>{theme === "dark-theme" ? "Light Mode" : "Dark Mode"}</span>
      </SettingsButtonItem>
    </>
  );
}

const SettingsButtonItem = ({ buttonName, imageAlt, imageSource, onClick, children }) => {
  return (
    <button
      aria-label={buttonName}
      className="SettingsItem"
      onClick={onClick}>
      <img alt={imageAlt} src={imageSource} />
      {children}
    </button>
  );
}

SettingsButtonItem.propTypes = {
  buttonName: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  imageSource: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

const SettingsLinkItem = ({ linkName, imageAlt, imageSource, destination, children }) => {
  return (
    <Link
      aria-label={linkName}
      className="SettingsItem"
      to={destination}>
      <img alt={imageAlt} src={imageSource} />
      {children}
    </Link>
  );
}

SettingsLinkItem.defaultProps = {
  destination: "/"
}

SettingsLinkItem.propTypes = {
  linkName: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  imageSource: PropTypes.string.isRequired,
  destination: PropTypes.string
}

const BackButton = ({ linkName, imageAlt, imageSource, destination, children }) => {
  return (
    <Link
      aria-label={linkName}
      className="BackButton"
      to={destination}>
      <img alt={imageAlt} src={imageSource} />
      {children}
    </Link>
  );
}

BackButton.defaultProps = {
  destination: "/"
}

BackButton.propTypes = {
  linkName: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  imageSource: PropTypes.string.isRequired,
  destination: PropTypes.string
}


export default Settings;
export { SettingsButtonItem, SettingsLinkItem, BackButton };

