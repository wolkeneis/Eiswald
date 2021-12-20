import { Storage } from "@capacitor/storage";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router";
import { CSSTransition } from "react-transition-group";
import { fetchPlaylists } from "../../logic/node";
import { addPlaylistPreviews, clearPlaylistPreviews, setNodes } from "../../redux/contentSlice";
import { NativeChatPage } from "../chat/ChatPage";
import Loader from "../Loader";
import { NativeSettingsPage } from "../settings/SettingsPage";
import "./NativeContent.scss";
import PlaylistPreviews from "./PlaylistPreviews";
import VideoArea from "./VideoArea";

const PrivateKey = lazy(() => import("../chat/pages/PrivateKey"));
const Chat = lazy(() => import("../chat/pages/Chat"));
const ChatOverview = lazy(() => import("../chat/pages/ChatOverview"));
const Settings = lazy(() => import("../settings/pages/Settings"));
const ProfileSettings = lazy(() => import("../settings/pages/ProfileSettings"));
const NodeSettings = lazy(() => import("../settings/pages/NodeSettings"));
const ContactSettings = lazy(() => import("../settings/pages/ContactSettings"));
const DeveloperSettings = lazy(() => import("../settings/pages/DeveloperSettings"));

const NativeContent = () => {
  const nodes = useSelector(state => state.content.nodes);
  const chatOverviewRef = useRef();
  const chatRef = useRef();
  const profileRef = useRef();
  const nodesRef = useRef();
  const contactsRef = useRef();
  const developerRef = useRef();
  const settingsRef = useRef();
  const homeRef = useRef();
  const watchRef = useRef();
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
      for (const host in nodes) {
        if (Object.hasOwnProperty.call(nodes, host)) {
          const node = nodes[host];
          if (node.state !== "maintenance") {
            try {
              fetchPlaylists(node)
                .then(response => response.json())
                .then(fetchedPreviews => {
                  fetchedPreviews.forEach(fetchedPreview => fetchedPreview.node = node.origin);
                  dispatch(addPlaylistPreviews(fetchedPreviews));
                }).catch(() => { });
            } catch { }
          }
        }
      }
    }
    return () => {
      dispatch(clearPlaylistPreviews());
    }
  }, [dispatch, nodes]);

  return (
    <div className="NativeContent">
      <Route path="/chat/:userId" exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={chatRef}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="content-menu">
            <div ref={chatRef} className="content-menu">
              <NativeChatPage>
                <Suspense fallback={<Loader />}>
                  {match && match.params.userId && match.params.userId === "authenticate"
                    ? <PrivateKey />
                    : <Chat userId={match ? match.params.userId : undefined} />
                  }
                </Suspense>
              </NativeChatPage>
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route path="/chat" exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={chatOverviewRef}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="content-menu">
            <div ref={chatOverviewRef} className="content-menu">
              <NativeChatPage>
                <Suspense fallback={<Loader />}>
                  <ChatOverview />
                </Suspense>
              </NativeChatPage>
            </div>
          </CSSTransition>
        )}
      </Route>
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
      <Route path="/settings/contacts" exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={contactsRef}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="content-menu">
            <div ref={contactsRef} className="content-menu">
              <NativeSettingsPage>
                <Suspense fallback={<Loader />}>
                  <ContactSettings />
                </Suspense>
              </NativeSettingsPage>
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route path="/settings/developer" exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={developerRef}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="content-menu">
            <div ref={developerRef} className="content-menu">
              <NativeSettingsPage>
                <Suspense fallback={<Loader />}>
                  <DeveloperSettings />
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
      <Route path={"/watch"} exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={watchRef}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="content-menu">
            <div ref={watchRef} className="content-menu">
              <VideoArea />
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
              <PlaylistPreviews nodes={nodes ?? {}} />
            </div>
          </CSSTransition>
        )}
      </Route>
    </div>
  );
}

export default NativeContent;
