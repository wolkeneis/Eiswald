import { useRef } from "react";
import { Route } from "react-router";
import { CSSTransition } from "react-transition-group";
import backIcon from "../../media/back.svg";
import { BackButton } from "../settings/pages/Settings";
import Branding from "./Branding";
import "./NativeHeader.scss";

const NativeHeader = () => {
  const back = useRef();
  const branding = useRef();

  return (
    <header className="NativeHeader">
      <Route path={["/settings/profile", "/settings/nodes", "/settings/contacts", "/settings/developer"]} exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={back}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="secondary-header">
            <div ref={back} className="secondary-header">
              <BackButton linkName="Back to Settings" imageAlt="Back" imageSource={backIcon} destination="/settings">
                <span>Back</span>
              </BackButton>
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route path="/chat/:userId([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})" exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={back}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="secondary-header">
            <div ref={back} className="secondary-header">
              <BackButton linkName="Back to Overview" imageAlt="Back" imageSource={backIcon} destination="/chat">
                <span>Back</span>
              </BackButton>
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route path={"/watch"} exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={back}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="secondary-header">
            <div ref={back} className="secondary-header">
              <BackButton linkName="Back to Settings" imageAlt="Back" imageSource={backIcon} destination="/">
                <span>Back</span>
              </BackButton>
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route path={["/", "/chat", "/chat/authenticate", "/settings", "/authorize"]} exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={branding}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="primary-header">
            <div ref={branding} className="primary-header">
              <Branding />
            </div>
          </CSSTransition>
        )}
      </Route>
    </header>
  );
}

export default NativeHeader;
