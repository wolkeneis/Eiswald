import PropTypes from "prop-types";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvatar, nodeStateClass, nodeStateText } from "../../logic/node";
import { addNode, removeNode, setNodeState } from "../../redux/contentSlice";
import "./NodeSettings.scss";

const NodeSettings = () => {
  const [origin, setOrigin] = useState("");
  const [node, setNode] = useState();
  const timeout = useRef();
  const inputField = useRef();
  const nodes = useSelector(state => state.content.nodes);
  const dispatch = useDispatch();

  useEffect(() => {
    for (const origin in nodes) {
      if (Object.hasOwnProperty.call(nodes, origin)) {
        const node = nodes[origin];
        try {
          fetch(new Request(node.origin))
            .then(response => response.json())
            .then(data => ({
              authenticated: data.authenticated,
              profile: {
                name: data.session.username,
                avatar: data.session.avatar,
                authorized: data.session.authorized
              }
            }))
            .then(state => {
              if (nodeStateClass(node) !== nodeStateClass({ state: state })) {
                dispatch(setNodeState({
                  origin: node.origin,
                  state: state
                }));
              }
            }
            ).catch(error => {
              dispatch(setNodeState({
                origin: node.origin,
                state: undefined
              }));
            });
        } catch {
          dispatch(setNodeState({
            origin: node.origin,
            state: undefined
          }));
        }
      }
    }
  }, [nodes, dispatch]);

  useEffect(() => {
    try {
      fetch(new Request(origin))
        .then(response => response.json())
        .then(data => ({
          authenticated: data.authenticated,
          profile: {
            name: data.session.username,
            avatar: data.session.avatar,
            authorized: data.session.authorized
          }
        }))
        .then(state => {
          setNode({
            origin: origin,
            state: state
          });
        }
        ).catch(error => { });
    } catch { }
    return () => {
      setNode();
    }
  }, [origin]);

  const onChange = (event) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setOrigin(event.target.value.toLowerCase());
    }, 500);
  }

  const onAdd = () => {
    if (node) {
      inputField.current.value = "";
      setOrigin("");
      dispatch(addNode(node));
    }
  }

  return (
    <div className="NodeSettings">
      <h1>Node Settings</h1>
      {Object.values(nodes).map(node => (
        <Suspense key={node.origin}>
          <Node node={node} />
        </Suspense>
      ))}
      <NodePreview inputField={inputField} node={node} onChange={onChange} onAdd={onAdd} />
    </div>
  );
}

const NodePreview = ({ inputField, node, onChange, onAdd }) => {
  return (
    <>
      <div className="NodePreview">
        <input aria-label="Node Origin" placeholder="Hostname..." ref={inputField} type="text" onChange={onChange} />
        <div className="preview-state">
          <div>
            <div className={`traffic-light ${nodeStateClass(node)}`}></div>
            <span>{nodeStateText(node)}</span>
          </div>
          <AddButton onClick={onAdd} />
        </div>
      </div>
    </>
  );
}

NodePreview.propTypes = {
  node: PropTypes.object,
  inputField: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
}

const AddButton = ({ onClick }) => {
  return (
    <button aria-label="Add Node" className="AddButton" onClick={onClick}>✓</button>
  );
}

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

const Node = ({ node }) => {
  const [source, setSource] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (node.state && node.state.profile && node.state.profile.avatar) {
      setSource(fetchAvatar(node.state.profile.avatar));
    }
  }, [node]);

  useEffect(() => {
    return () => {
      if (source) {
        try {
          URL.revokeObjectURL(source.read());
        } finally { }
      }
    };
  }, [source]);

  return (
    <div className="Node">
      <div className="Node-origin">
        <span>{node.origin}</span>
      </div>
      {node.state && node.state.profile && node.state.profile.name && node.state.profile.avatar &&
        <div className="Node-profile">
          <img alt="Avatar" src={source && source.read()} />
          <span>{node.state.profile.name}</span>
        </div>
      }
      <div className="Node-state">
        <div className={`traffic-light ${nodeStateClass(node)}`}></div>
        <span>{nodeStateText(node)}</span>
        <button aria-label="Remove Node" className="Node-remove" onClick={() => dispatch(removeNode(node))}>×</button>
      </div>
    </div>
  );
}

Node.propTypes = {
  node: PropTypes.object.isRequired
}


export default NodeSettings;
