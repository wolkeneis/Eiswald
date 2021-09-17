import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchAvatar } from "../../../logic/profile";
import ProfileConnections from "./ProfileConnections";
import "./ProfileSettings.scss";

const ProfileSettings = () => {
  const [profile, setProfile] = useState();
  const [connections, setConnections] = useState();

  useEffect(() => {
    try {
      fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile`, {
        method: "POST",
        credentials: "include",
        redirect: "manual"
      }))
        .then(response => response.json())
        .then(profile => {
          setProfile(profile);
          fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/connections`, {
            method: "POST",
            credentials: "include",
            redirect: "manual"
          }))
            .then(response => response.json())
            .then(connections => {
              setConnections(connections);
            })
            .catch(() => { });
        })
        .catch(() => { });
    } catch { }
    return () => {
      setProfile();
      setConnections();
    }
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <div className="Profile">
        {profile
          ? <Profile profile={profile} />
          : <span>Du bist nicht angemeldet</span>
        }
      </div>
      {profile
        ? <h3>Connections</h3>
        : <></>
      }
      <ProfileConnections connections={connections} loggedIn={profile ? true : false} />
    </>
  );
}

const Profile = ({ profile }) => {
  const [source, setSource] = useState();

  useEffect(() => {
    if (profile && profile.avatar) {
      setSource(fetchAvatar(profile.avatar));
    }
  }, [profile]);

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
    <div className="ProfileInfo">
      <img alt="Avatar" src={source && source.read()} />
      <span>{profile.username}</span>
    </div>
  );
}

Node.propTypes = {
  profile: PropTypes.object.isRequired
}

export default ProfileSettings;
