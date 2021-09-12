import { Device } from '@capacitor/device';
import { Storage } from "@capacitor/storage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import "./App.scss";
import Content from "./component/content/Content";
import NativeContent from "./component/content/NativeContent";
import Footer from "./component/footer/Footer";
import NativeFooter from "./component/footer/NativeFooter";
import Header from "./component/header/Header";
import NativeHeader from "./component/header/NativeHeader";
import NodeSettingsModal from "./component/settings/NodeSettingsModal";
import { selectTheme, setNative } from "./redux/interfaceSlice";

function App() {
  const native = useSelector(state => state.interface.native);
  const theme = useSelector(state => state.interface.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    Device.getInfo().then(info => {
      dispatch(setNative(info.operatingSystem === 'ios' || info.operatingSystem === 'android'));
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
        {native !== undefined && (native
          ? (<>
            <NativeHeader />
            <NativeContent />
            <NativeFooter />
          </>)
          : (<>
            <Header />
            <NodeSettingsModal />
            <Content />
            <Footer />
          </>))
        }

      </BrowserRouter>
    </div>
  );
}

export default App;
