import { Storage } from "@capacitor/storage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import Content from "./component/content/Content";
import Footer from "./component/footer/Footer";
import Header from "./component/header/Header";
import NodeSettingsModal from "./component/settings/NodeSettingsModal";
import { selectTheme } from "./redux/interfaceSlice";

function App() {
  const theme = useSelector(state => state.interface.theme);
  const dispatch = useDispatch();

  useEffect(() => {
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
    <div className={`App ${theme}`}>
      <Header />
      <NodeSettingsModal />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
