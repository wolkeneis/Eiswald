import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return
    };

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

useInterval.propTypes = {
  callback: PropTypes.func.isRequired,
  delay: PropTypes.number
}

export default useInterval;
