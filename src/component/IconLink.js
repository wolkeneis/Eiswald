import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./IconLink.scss";

const IconLink = ({ linkName, imageAlt, imageSource, destination }) => {
  return (
    <NavLink
      aria-label={linkName}
      className="IconLink"
      exact
      to={destination}>
      <img alt={imageAlt} src={imageSource} />
    </NavLink>
  );
}

IconLink.defaultProps = {
  destination: "/"
}

IconLink.propTypes = {
  linkName: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  imageSource: PropTypes.string.isRequired,
  destination: PropTypes.string
}

export default IconLink;
