import PropTypes from "prop-types";
import { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNodeSettings } from "../../redux/interfaceSlice";
import Loader from "../Loader";
import "./NodeSettingsModal.scss";

const NodeSettings = lazy(() => import("./NodeSettings"));

const NodeSettingsModal = () => {
  const nodeSettings = useSelector(state => state.interface.nodeSettings);
  const dispatch = useDispatch();

  return (
    <>
      {nodeSettings &&
        <div className="NodeSettingsModal">
          <CloseButton onClick={() => dispatch(hideNodeSettings())} />
          <Suspense fallback={<Loader />}>
            <NodeSettings />
          </Suspense>
        </div>
      }
    </>
  );
}

const CloseButton = ({ onClick }) => {
  return (
    <button aria-label="Close Settings" className="CloseButton" onClick={onClick}>×</button>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
}


export default NodeSettingsModal;
