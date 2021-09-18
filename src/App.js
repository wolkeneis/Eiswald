import { Device } from '@capacitor/device';
import { Storage } from "@capacitor/storage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import "./App.scss";
import Content from "./component/content/Content";
import NativeContent from "./component/content/NativeContent";
import Footer from "./component/footer/Footer";
import NativeFooter from "./component/footer/NativeFooter";
import Header from "./component/header/Header";
import NativeHeader from "./component/header/NativeHeader";
import QueryRedirect from './component/QueryRedirect';
import Authorize from './component/settings/pages/Authorize';
import { selectTheme, setNative } from "./redux/interfaceSlice";

function App() {
  const native = useSelector(state => state.interface.native);
  const theme = useSelector(state => state.interface.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    Device.getInfo().then(info => {
      const native = info.operatingSystem === 'ios' || info.operatingSystem === 'android';
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
    <div className={`App ${theme} ${native ? 'native' : ''}`}>
      <BrowserRouter>
        <Switch>
          <QueryRedirect exact from="/redirect/profile" to="/settings/profile" />
          <QueryRedirect exact from="/redirect/nodes" to="/settings/nodes" />
          <QueryRedirect exact from="/redirect/authorize" to="/authorize" />
          <Route path="/authorize"
            children={({ match }) => {
              return native !== undefined && (native
                ? (<>
                  <NativeHeader />
                  <Authorize match={match} />
                </>)
                : (<>
                  <Header />
                  <Authorize match={match} />
                </>))
            }}>

          </Route>
          <Route path="/">
            {native !== undefined && (native
              ? (<>
                <NativeHeader />
                <NativeContent />
                <NativeFooter />
              </>)
              : (<>
                <Header />
                <Content />
                <Footer />
              </>))
            }
          </Route>
        </Switch>

      </BrowserRouter>
    </div>
  );
}

export default App;
