import { useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router";
import { createRoom } from "../../logic/connection";
import createIcon from "../../media/create-room.svg";
import downloadIcon from "../../media/download.svg";
import listIcon from "../../media/list.svg";
import settingsIcon from "../../media/settings.svg";
import watchIcon from "../../media/watch.svg";
import IconButton from "../IconButton";
import IconLink from "../IconLink";
import "./NativeFooter.scss";

const NativeFooter = () => {
  const native = useSelector(state => state.interface.native);
  const history = useHistory();

  return (
    <footer className="NativeFooter">
      <nav className="NativeNavigator">
        <Switch>
          <Route path="/watch">
            <IconLink linkName="List" imageAlt="List Icon" imageSource={listIcon} destination="/" />
            <IconButton buttonName="Create Room" imageAlt="Create Room Icon" imageSource={createIcon} onClick={() => createRoom()} />
            <IconLink linkName="Downloads" imageAlt="Download Icon" imageSource={downloadIcon} destination="/downloads" />
            <IconLink linkName="Settings" imageAlt="Settings Icon" imageSource={settingsIcon} destination="/settings" />
          </Route>
          <Route path="/">
            <IconLink linkName="List" imageAlt="List Icon" imageSource={listIcon} destination="/" />
            <IconButton buttonName="Watch" imageAlt="Watch Icon" imageSource={watchIcon} onClick={() => {
              if (native) {
                history.push("/watch");
              }
            }} />
            <IconLink linkName="Downloads" imageAlt="Download Icon" imageSource={downloadIcon} destination="/downloads" />
            <IconLink linkName="Settings" imageAlt="Settings Icon" imageSource={settingsIcon} destination="/settings" />
          </Route>
        </Switch>
      </nav>
    </footer>
  );
}


export default NativeFooter;
