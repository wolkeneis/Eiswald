import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moon from "../../media/moon.svg";
import nodes from "../../media/nodes.svg";
import profile from "../../media/profile.svg";
import sun from "../../media/sun.svg";
import { toggleTheme } from "../../redux/interfaceSlice";
import "./NativeSettings.scss";

const NativeSettings = () => {
  const theme = useSelector(state => state.interface.theme);
  const dispatch = useDispatch();

  return (
    <>
      <h1>Settings</h1>
      <SettingsLinkItem linkName="Account Settings" imageAlt="Account Icon" imageSource={profile} destination="/settings/profile">
        <span>Profile</span>
      </SettingsLinkItem>
      <SettingsLinkItem linkName="Node Settings" imageAlt="Node Connections" imageSource={nodes} destination="/settings/nodes">
        <span>Nodes</span>
      </SettingsLinkItem>
      <SettingsButtonItem
        buttonName="Theme Toggler"
        imageAlt={theme === "dark-theme" ? "Sun Icon" : "Moon Icon"}
        imageSource={theme === "dark-theme" ? sun : moon}
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
      className="NativeSettingsItem"
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
      className="NativeSettingsItem"
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

export default NativeSettings;
export { SettingsButtonItem, SettingsLinkItem };

