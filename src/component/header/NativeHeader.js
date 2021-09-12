import { useRef } from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import Branding from './Branding';
import './NativeHeader.scss';

const NativeHeader = () => {
  const back = useRef();
  const branding = useRef();

  return (
    <header className="NativeHeader">
      <Route path="/settings/nodes" exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={back}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="secondary-header">
            <div ref={back} className="container">
              <Link className="link" to="/settings">
                &#8592; Back
              </Link>
            </div>
          </CSSTransition>
        )}
      </Route>
      <Route path={["/", "/downloads", "/settings"]} exact>
        {({ match }) => (
          <CSSTransition
            nodeRef={branding}
            in={match !== null}
            unmountOnExit
            timeout={500}
            classNames="primary-header">
            <div ref={branding} className="container">
              <Branding />
            </div>
          </CSSTransition>
        )}
      </Route>
    </header>
  );
}

export default NativeHeader;
