import PropTypes from "prop-types";
import { Suspense, useEffect, useState } from "react";
import { fetchAvatar, fetchProfile } from "../../../logic/profile";
import Loader from "../../Loader";
import ProfileConnections from "./ProfileConnections";
import "./ProfileSettings.scss";


const ProfileSettings = () => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    setProfile(fetchProfile());
    return () => {
      setProfile();
    }
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <div className="Profile">
        {profile
          ? <Profile profile={profile && profile.read()} />
          : <span>Du bist nicht angemeldet</span>
        }
      </div>
      {profile
        ? <h3>Connections</h3>
        : <></>
      }
      <Suspense fallback={<Loader />}>
        <ProfileConnections loggedIn={profile ? true : false} />
      </Suspense>
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
