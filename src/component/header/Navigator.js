import { useDispatch, useSelector } from "react-redux";
import moon from "../../media/moon.svg";
import settings from "../../media/settings.svg";
import sun from "../../media/sun.svg";
import { showNodeSettings, toggleTheme } from "../../redux/interfaceSlice";
import IconButton from "../IconButton";
import "./Navigator.scss";

const Navigator = () => {
  const theme = useSelector(state => state.interface.theme);
  const dispatch = useDispatch();

  return (
    <nav className="Navigator">
      <IconButton buttonName="Settings" imageAlt="Settings Icon" imageSource={settings} onClick={() => dispatch(showNodeSettings())} />
      <IconButton buttonName="Theme Toggler"
        imageAlt={theme === "dark-theme" ? "Sun Icon" : "Moon Icon"}
        imageSource={theme === "dark-theme" ? sun : moon}
        onClick={() => dispatch(toggleTheme())} />
    </nav>
  );
}

export default Navigator;
