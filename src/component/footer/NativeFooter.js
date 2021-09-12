import { Route, Switch } from 'react-router';
import download from "../../media/download.svg";
import list from "../../media/list.svg";
import settings from "../../media/settings.svg";
import IconLink from '../IconLink';
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
          <IconLink linkName="List" imageAlt="List Icon" imageSource={list} destination="/" />
          <IconLink linkName="Downloads" imageAlt="Download Icon" imageSource={download} destination="/downloads" />
          <IconLink linkName="Settings" imageAlt="Settings Icon" imageSource={settings} destination="/settings" />
        </Route>
      </Switch>
    </nav>
  );
}


export default NativeFooter;
