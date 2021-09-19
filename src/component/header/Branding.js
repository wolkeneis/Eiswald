import { Link } from "react-router-dom";
import logo from "../../media/logo_snow.svg";
import "./Branding.scss";

const Branding = () => {
  return (
    <Link className="Branding link" to="/">
      <img src={logo} alt="Logo" />
      <h1><span>Eis</span>wald</h1>
    </Link>
  );
}

export default Branding;
