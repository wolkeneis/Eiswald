import PropTypes from "prop-types";
import { Redirect, useLocation } from "react-router";

const QueryRedirect = ({ children, to, ...props }) => {
  const { search } = useLocation();

  return (
    <Redirect to={to + search} {...props}>
      {children}
    </Redirect>
  );
};

QueryRedirect.propTypes = {
  to: PropTypes.string
}

export default QueryRedirect;