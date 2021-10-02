import { Route, Switch } from "react-router";
import downloadIcon from "../../media/download.svg";
import listIcon from "../../media/list.svg";
import settingsIcon from "../../media/settings.svg";
import IconLink from "../IconLink";
import "./NativeFooter.scss";

const NativeFooter = () => {
  return (
    <footer className="NativeFooter">
      <NativeNavigator />
    </footer>
  );
}

const NativeNavigator = () => {
  return (
    <nav className="NativeNavigator">
      <Switch>
        <Route path="/">
          <IconLink linkName="List" imageAlt="List Icon" imageSource={listIcon} destination="/" />
          <IconLink linkName="Downloads" imageAlt="Download Icon" imageSource={downloadIcon} destination="/downloads" />
          <IconLink linkName="Settings" imageAlt="Settings Icon" imageSource={settingsIcon} destination="/settings" />
        </Route>
      </Switch>
    </nav>
  );
}


export default NativeFooter;
