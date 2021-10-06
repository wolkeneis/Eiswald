import PropTypes from "prop-types";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAvatar, fetchNodeProfile, fetchNodeState, nodeStateClass, nodeStateText } from "../../../logic/node";
import { addNode, removeNode, setNodeState } from "../../../redux/contentSlice";
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
          fetchNodeState(node.origin)
            .then(nodeInfo => {
              fetchNodeProfile(node.origin)
                .then(profile => {
                  const patchedNode = {
                    origin: node.origin,
                    state: nodeInfo.state,
                    name: nodeInfo.name,
                    profile: profile
                  }
                  if (nodeStateClass(node) !== nodeStateClass(patchedNode)) {
                    dispatch(setNodeState(patchedNode));
                  }
                }).catch(() => {
                  dispatch(setNodeState({
                    origin: node.origin,
                    state: nodeInfo.state,
                    name: nodeInfo.name,
                    profile: null
                  }));
                });
            }).catch(() => {
              dispatch(setNodeState({
                origin: node.origin,
                state: null,
                name: null,
                profile: null
              }));
            });
        } catch {
          dispatch(setNodeState({
            origin: node.origin,
            state: null,
            name: null,
            profile: null
          }));
        }
      }
    }
  }, [nodes, dispatch]);

  useEffect(() => {
    if (origin) {
      try {
        fetchNodeState(origin)
          .then(nodeInfo => {
            fetchNodeProfile(origin)
              .then(profile => {
                const patchedNode = {
                  origin: origin,
                  state: nodeInfo.state,
                  name: nodeInfo.name,
                  profile: profile
                }
                setNode(patchedNode);
              }).catch(() => {
                setNode({
                  origin: origin,
                  state: nodeInfo.state,
                  name: nodeInfo.name,
                  profile: null
                });
              });
          }
          ).catch(() => { });
      } catch { }
    }
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
    <>
      <h1>Node Settings</h1>
      <NodePreview inputField={inputField} node={node} onChange={onChange} onAdd={onAdd} />
      {Object.values(nodes).map(node => (
        <Suspense key={node.origin}>
          <Node node={node} />
        </Suspense>
      ))}
    </>
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
    if (node.profile && node.profile.avatar) {
      setSource(fetchAvatar(node.profile.avatar));
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
        <span>{node.name ?? node.origin}</span>
      </div>
      {node.profile && node.profile.avatar
        ? <>
          <div className="Node-profile">
            <img alt="Avatar" src={source && source.read()} />
            <span>{node.profile.username}</span>
          </div>
        </>
        : <>
          {node.state && node.state !== "maintenance" &&
            <a href={`${node.origin}/authenticate`}>Login</a>
          }
        </>
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
