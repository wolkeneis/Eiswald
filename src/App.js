import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
import { Storage } from "@capacitor/storage";
import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useParams } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import Loader from "./component/Loader";
import QueryRedirect from "./component/QueryRedirect";
import { joinRoom } from "./logic/connection";
import { addContact } from "./logic/contacts";
import "./logic/polyfills";
import { initializeKeys } from "./logic/signal";
import { selectTheme, setMobile, setNative } from "./redux/interfaceSlice";

const Content = lazy(() => import("./component/content/Content"));
const NativeContent = lazy(() => import("./component/content/NativeContent"));
const Footer = lazy(() => import("./component/footer/Footer"));
const NativeFooter = lazy(() => import("./component/footer/NativeFooter"));
const Header = lazy(() => import("./component/header/Header"));
const NativeHeader = lazy(() => import("./component/header/NativeHeader"));
const Authorize = lazy(() => import("./component/settings/pages/Authorize"));

function App() {
  const mobile = useSelector(state => state.interface.mobile);
  const theme = useSelector(state => state.interface.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    const native = Capacitor.isNativePlatform();
    dispatch(setNative(native));
    initializeKeys(native);
    Device.getInfo().then(info => {
      const mobile = info.operatingSystem === "ios" || info.operatingSystem === "android";
      dispatch(setMobile(mobile));
      if (mobile) {
        const queryList = window.matchMedia("(orientation: portrait)");
        queryList.addEventListener("change", event => {
          const video = document.getElementById("video-wrapper");
          if (video) {
            if (event.matches) {
              if (document.fullscreenElement === video) {
                document.exitFullscreen();
              }
            }
            else {
              if (document.fullscreenElement !== video) {
                video.requestFullscreen().catch((error) => console.error(error)/* ASK FOR FULLSCREEN*/);
              }
            }
          }
        });
      }
    });
    Storage.get({ key: "theme" }).then(theme => {
      if (theme.value) {
        dispatch(selectTheme(theme.value));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (theme) {
      Storage.set({ key: "theme", value: theme });
    }
  }, [theme]);


  return (
    <div className={`App ${theme} ${mobile ? "mobile" : ""}`}>
      <BrowserRouter>
        <Switch>
          <Route path="/redirect">
            <Switch>
              <QueryRedirect exact from="/redirect/profile" to="/settings/profile" />
              <QueryRedirect exact from="/redirect/nodes" to="/settings/nodes" />
              <QueryRedirect exact from="/redirect/authorize" to="/authorize" />
            </Switch>
          </Route>
          <Route from="/invite/:roomId">
            <InviteHandler />
          </Route>
          <Route from="/addcontact/:userId">
            <AddContactHandler />
          </Route>
          <Route path="/authorize"
            children={({ match }) => {
              return mobile !== undefined && (mobile
                ? (<>
                  <Suspense fallback={<Loader />}>
                    <NativeHeader />
                    <Authorize match={match} />
                  </Suspense>
                </>)
                : (<>
                  <Suspense fallback={<Loader />}>
                    <Header />
                    <Authorize match={match} />
                  </Suspense>
                </>))
            }}>

          </Route>
          <Route path={"/"}>
            {mobile !== undefined && (mobile
              ? (<>
                <Suspense fallback={<Loader />}>
                  <NativeHeader />
                  <NativeContent />
                  <NativeFooter />
                </Suspense>
              </>)
              : (<>
                <Suspense fallback={<Loader />}>
                  <Header />
                  <Content />
                  <Footer />
                </Suspense>
              </>))
            }
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

const InviteHandler = ({ children, ...props }) => {
  const [requestSent, setRequestSent] = useState(false);
  const mobile = useSelector(state => state.interface.mobile);
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
      setRequestSent(true);
    }
  }, [roomId, mobile]);

  return (
    <>
      {requestSent && mobile !== undefined &&
        <Redirect to={mobile ? "/watch" : "/"} {...props} >
          {children}
        </Redirect>
      }
    </>
  );
}

const AddContactHandler = ({ children, ...props }) => {
  const [requestSent, setRequestSent] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    if (userId) {
      addContact(userId).then(() => setRequestSent(true)).catch(() => setRequestSent(true));
    }
  }, [userId]);

  return (
    <>
      {requestSent &&
        <Redirect to="/settings/contacts" {...props} >
          {children}
        </Redirect>
      }
    </>
  );
}

export default App;
