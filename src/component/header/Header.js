import "./Header.scss";
import Navigator from "./Navigator";
import logo from "../../media/logo_snow.svg";

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

const Branding = () => {
  return (
    <button className="Branding">
      <img src={logo} alt="Logo" />
      <h1><span>Eis</span>wald</h1>
    </button>
  );
}

export default Header;
