import { lazy, Suspense, useRef } from "react";
import { Route, useHistory } from "react-router";
import { CSSTransition } from "react-transition-group";
import { createRoom } from "../../logic/connection";
import backIcon from "../../media/back.svg";
import createIconIcon from "../../media/create-room.svg";
import settingsIcon from "../../media/settings.svg";
import IconButton from "../IconButton";
import Loader from "../Loader";
import Settings, { BackButton } from "../settings/pages/Settings";
import SettingsPage from "../settings/SettingsPage";
import "./Navigator.scss";

const ProfileSettings = lazy(() => import("../settings/pages/ProfileSettings"));
const NodeSettings = lazy(() => import("../settings/pages/NodeSettings"));

const Navigator = () => {
  const history = useHistory();
  const profileRef = useRef();
  const nodesRef = useRef();
  const settingsRef = useRef();

  return (
    <nav className="Navigator">
      <IconButton buttonName="Create Room" imageAlt="Create Room Icon" imageSource={createIconIcon} onClick={() => createRoom()} />
      <IconButton buttonName="Settings" imageAlt="Settings Icon" imageSource={settingsIcon} onClick={() => history.push("/settings")} />
      <Route path={"/settings"}>
        <SettingsPage>
          <Route path="/settings/profile" exact>
            {({ match }) => (
              <CSSTransition
                nodeRef={profileRef}
                in={match !== null}
                unmountOnExit
                timeout={500}
                classNames="secondary-menu">
                <div ref={profileRef} className="secondary-menu">
                  <Suspense fallback={<Loader />}>
                    <BackButton linkName="Back to Settings" imageAlt="Back" imageSource={backIcon} destination="/settings">
                      <span>Back</span>
                    </BackButton>
                    <ProfileSettings />
                  </Suspense>
                </div>
              </CSSTransition>
            )}
          </Route>
          <Route path="/settings/nodes" exact>
            {({ match }) => (
              <CSSTransition
                nodeRef={nodesRef}
                in={match !== null}
                unmountOnExit
                timeout={500}
                classNames="secondary-menu">
                <div ref={nodesRef} className="secondary-menu">
                  <Suspense fallback={<Loader />}>
                    <BackButton linkName="Back to Settings" imageAlt="Back" imageSource={backIcon} destination="/settings">
                      <span>Back</span>
                    </BackButton>
                    <NodeSettings />
                  </Suspense>
                </div>
              </CSSTransition>
            )}
          </Route>
          <Route path={"/settings"} exact>
            {({ match }) => (
              <CSSTransition
                nodeRef={settingsRef}
                in={match !== null}
                unmountOnExit
                timeout={500}
                classNames="primary-menu">
                <div ref={settingsRef} className="primary-menu">
                  <Suspense fallback={<Loader />}>
                    <Settings />
                  </Suspense>
                </div>
              </CSSTransition>
            )}
          </Route>
        </SettingsPage>
      </Route>

    </nav>
  );
}

export default Navigator;
