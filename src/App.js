import { Device } from "@capacitor/device";
import { Storage } from "@capacitor/storage";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import Loader from "./component/Loader";
import QueryRedirect from "./component/QueryRedirect";
import { selectTheme, setNative } from "./redux/interfaceSlice";

const Content = lazy(() => import("./component/content/Content"));
const NativeContent = lazy(() => import("./component/content/NativeContent"));
const Footer = lazy(() => import("./component/footer/Footer"));
const NativeFooter = lazy(() => import("./component/footer/NativeFooter"));
const Header = lazy(() => import("./component/header/Header"));
const NativeHeader = lazy(() => import("./component/header/NativeHeader"));
const Authorize = lazy(() => import("./component/settings/pages/Authorize"));

function App() {
  const native = useSelector(state => state.interface.native);
  const theme = useSelector(state => state.interface.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    Device.getInfo().then(info => {
      const native = info.operatingSystem === "ios" || info.operatingSystem === "android";
      dispatch(setNative(native));
      if (native) {
        const queryList = window.matchMedia("(orientation: portrait)");
        queryList.addEventListener("change", event => {
          const video = document.querySelector("video");
          if (video) {
            if (event.matches) {
              if (document.fullscreenElement === video) {
                document.exitFullscreen();
              }
            }
            else {
              if (document.fullscreenElement !== video) {
                video.requestFullscreen();
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
    <div className={`App ${theme} ${native ? "native" : ""}`}>
      <BrowserRouter>
        <Switch>
          <QueryRedirect exact from="/redirect/profile" to="/settings/profile" />
          <QueryRedirect exact from="/redirect/nodes" to="/settings/nodes" />
          <QueryRedirect exact from="/redirect/authorize" to="/authorize" />
          <Route path="/authorize"
            children={({ match }) => {
              return native !== undefined && (native
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
          <Route path="/">
            {native !== undefined && (native
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

export default App;
