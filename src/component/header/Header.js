import Branding from "./Branding";
import "./Header.scss";
import Navigator from "./Navigator";

const Header = () => {
  return (
    <header className="Header">
      <div className="container">
        <Branding />
        <Navigator />
      </div>
    </header>
  );
}

export default Header;
