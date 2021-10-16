import { lazy, Suspense, useRef } from "react";
import { useSelector } from "react-redux";
import { Route, useHistory } from "react-router";
import { CSSTransition } from "react-transition-group";
import { createRoom } from "../../logic/connection";
import backIcon from "../../media/back.svg";
import chatIcon from "../../media/chat.svg";
import createIcon from "../../media/create-room.svg";
import settingsIcon from "../../media/settings.svg";
import ChatPage from "../chat/ChatPage";
import HybridChat from "../chat/pages/HybridChat";
import IconButton from "../IconButton";
import Loader from "../Loader";
import { BackButton } from "../settings/pages/Settings";
import SettingsPage from "../settings/SettingsPage";
import useWindowSize from "../useWindowSize";
import "./Navigator.scss";

const PrivateKey = lazy(() => import("../chat/pages/PrivateKey"));
const Chat = lazy(() => import("../chat/pages/Chat"));
const ChatOverview = lazy(() => import("../chat/pages/ChatOverview"));
const Settings = lazy(() => import("../settings/pages/Settings"));
const ProfileSettings = lazy(() => import("../settings/pages/ProfileSettings"));
const NodeSettings = lazy(() => import("../settings/pages/NodeSettings"));
const ContactSettings = lazy(() => import("../settings/pages/ContactSettings"));
const DeveloperSettings = lazy(() => import("../settings/pages/DeveloperSettings"));

const Navigator = () => {
  const windowSize = useWindowSize();
  const mobile = useSelector(state => state.interface.mobile);
  const history = useHistory();
  const hybridChatRef = useRef();
  const chatOverviewRef = useRef();
  const chatRef = useRef();
  const profileRef = useRef();
  const nodesRef = useRef();
  const contactsRef = useRef();
  const developerRef = useRef();
  const settingsRef = useRef();

  const onClick = () => {
    createRoom();
    if (mobile) {
      history.push("/watch");
    }
  }

  return (
    <nav className="Navigator">
      <IconButton buttonName="Create Room" imageAlt="Create Room Icon" imageSource={createIcon} onClick={onClick} />
      <IconButton buttonName="Chat" imageAlt="Chat Icon" imageSource={chatIcon} onClick={() => history.push("/chat")} />
      <IconButton buttonName="Settings" imageAlt="Settings Icon" imageSource={settingsIcon} onClick={() => history.push("/settings")} />
      <Route path={"/chat"}>
        <ChatPage>
          {windowSize.width >= 1000
            ? <Route path={["/chat/:userId", "/chat"]}>
              {({ match }) => (
                <CSSTransition
                  nodeRef={hybridChatRef}
                  in={match !== null}
                  unmountOnExit
                  timeout={500}
                  classNames="primary-menu">
                  <div ref={hybridChatRef} className="primary-menu">
                    <Suspense fallback={<Loader />}>
                      <HybridChat userId={match ? match.params.userId : undefined} />
                    </Suspense>
                  </div>
                </CSSTransition>
              )}
            </Route>
            : <>
              <Route path="/chat/:userId" exact>
                {({ match }) => (
                  <CSSTransition
                    nodeRef={chatRef}
                    in={match !== null}
                    unmountOnExit
                    timeout={500}
                    classNames="secondary-menu">
                    <div ref={chatRef} className="secondary-menu">
                      <Suspense fallback={<Loader />}>
                        {match && match.params.userId && match.params.userId === "authenticate"
                          ? <PrivateKey />
                          : <Chat userId={match ? match.params.userId : undefined}>
                            <BackButton linkName="Back to Settings" imageAlt="Back" imageSource={backIcon} destination="/chat">
                              <span>Back</span>
                            </BackButton>
                          </Chat>
                        }
                      </Suspense>
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
                    classNames="primary-menu">
                    <div ref={chatOverviewRef} className="primary-menu">
                      <Suspense fallback={<Loader />}>
                        <ChatOverview />
                      </Suspense>
                    </div>
                  </CSSTransition>
                )}
              </Route>
            </>
          }
        </ChatPage>
      </Route>
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
          <Route path="/settings/contacts" exact>
            {({ match }) => (
              <CSSTransition
                nodeRef={contactsRef}
                in={match !== null}
                unmountOnExit
                timeout={500}
                classNames="secondary-menu">
                <div ref={contactsRef} className="secondary-menu">
                  <Suspense fallback={<Loader />}>
                    <BackButton linkName="Back to Settings" imageAlt="Back" imageSource={backIcon} destination="/settings">
                      <span>Back</span>
                    </BackButton>
                    <ContactSettings />
                  </Suspense>
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
                classNames="secondary-menu">
                <div ref={developerRef} className="secondary-menu">
                  <Suspense fallback={<Loader />}>
                    <BackButton linkName="Back to Settings" imageAlt="Back" imageSource={backIcon} destination="/settings">
                      <span>Back</span>
                    </BackButton>
                    <DeveloperSettings />
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
