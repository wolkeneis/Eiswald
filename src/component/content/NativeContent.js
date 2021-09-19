import { Storage } from "@capacitor/storage";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router";
import { CSSTransition } from "react-transition-group";
import { setNodes } from "../../redux/contentSlice";
import Loader from "../Loader";
import Settings from "../settings/pages/Settings";
import { NativeSettingsPage } from "../settings/SettingsPage";
import "./NativeContent.scss";
import PlaylistPreviews from "./PlaylistPreviews";
import VideoArea from "./VideoArea";

const ProfileSettings = lazy(() => import("../settings/pages/ProfileSettings"));
const NodeSettings = lazy(() => import("../settings/pages/NodeSettings"));

const NativeContent = () => {
  const nodes = useSelector(state => state.content.nodes);
  const profileRef = useRef();
  const nodesRef = useRef();
  const settingsRef = useRef();
  const downloadsRef = useRef();
  const homeRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    Storage.get({ key: "nodes" }).then(nodes => {
      if (nodes.value) {
        dispatch(setNodes(JSON.parse(nodes.value)));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (nodes) {
      Storage.set({ key: "nodes", value: JSON.stringify(nodes) });
    }
  }, [nodes]);

  return (
    <div className="NativeContent">
      <Route path="/settings/profile" exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={profileRef}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="content-menu">
            <div ref={profileRef} className="content-menu">
              <NativeSettingsPage>
                <Suspense fallback={<Loader />}>
                  <ProfileSettings />
                </Suspense>
              </NativeSettingsPage>
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
            classNames="content-menu">
            <div ref={nodesRef} className="content-menu">
              <NativeSettingsPage>
                <Suspense fallback={<Loader />}>
                  <NodeSettings />
                </Suspense>
              </NativeSettingsPage>
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
            classNames="content-menu">
            <div ref={settingsRef} className="content-menu">
              <NativeSettingsPage>
                <Suspense fallback={<Loader />}>
                  <Settings />
                </Suspense>
              </NativeSettingsPage>
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route path={"/downloads"} exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={downloadsRef}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="content-menu">
            <div ref={downloadsRef} className="content-menu">
              Downloads!
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route path={"/"} exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={homeRef}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="content-menu">
            <div ref={homeRef} className="content-menu">
              <VideoArea />
              <PlaylistPreviews nodes={nodes ?? {}} />
            </div>
          </CSSTransition>
        )}
      </Route>
    </div>
  );
}

export default NativeContent;
