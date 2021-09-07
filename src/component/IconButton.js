import PropTypes from "prop-types";
import "./IconButton.scss";

const IconButton = ({ buttonName, imageAlt, imageSource, onClick }) => {
  return (
    <button aria-label={buttonName} className="IconButton" >
      <img alt={imageAlt} src={imageSource} onClick={onClick} />
    </button>
  );
}

IconButton.propTypes = {
  buttonName: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  imageSource: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default IconButton;
