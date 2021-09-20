import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchAvatar, fetchProfileConnections, providers } from "../../../logic/profile";
import Loader from "../../Loader";
import "./ProfileConnections.scss";

const ProfileConnections = ({ loggedIn }) => {
  const [connections, setConnections] = useState();

  useEffect(() => {
    setConnections(fetchProfileConnections());
    return () => {
      setConnections();
    }
  }, []);

  return (
    <>
      {connections
        ? connections.read() &&
        <div className="ProfileConnections">
          {providers.map(provider => {
            if (connections.read()[provider.id]) {
              return (<Connection key={provider.id} provider={provider} connection={connections.read()[provider.id]} loggedIn={loggedIn} />)
            } else {
              return (<Connection key={provider.id} provider={provider} loggedIn={loggedIn} />)
            }
          })}
        </div>
        : <Loader />
      }
    </>
  );
}

ProfileConnections.propTypes = {
  loggedIn: PropTypes.bool
}

const Connection = ({ provider, connection, loggedIn }) => {
  const [source, setSource] = useState();

  useEffect(() => {
    if (connection && connection.avatar) {
      setSource(fetchAvatar(connection.avatar));
    }
  }, [connection]);

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
    <div className="Connection">
      <div className="ConnectionProvider">
        <img src={provider.icon} alt={`${provider.name} Logo`} />
        <span>{provider.name}</span>
      </div>
      <div className="ConnectionInfo">
        {connection
          ?
          <><img alt="Avatar" src={source && source.read()} />
            <span>{connection.username}</span></>
          : <a href={`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/login/${provider.id}`}>{loggedIn ? "Connect" : "Log In"}</a>
        }
      </div>
    </div>
  );
}

Connection.propTypes = {
  provider: PropTypes.object.isRequired,
  connection: PropTypes.object
}

export default ProfileConnections;
