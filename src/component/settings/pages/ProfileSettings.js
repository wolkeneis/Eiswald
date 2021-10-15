import PropTypes from "prop-types";
import QRCode from "qrcode.react";
import { Suspense, useEffect, useState } from "react";
import Switch from "react-switch";
import { fetchAvatar, fetchProfile, updatePrivacy } from "../../../logic/profile";
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
        {profile && profile.read()
          ? <Profile profile={profile && profile.read()} />
          : <span>You're not logged in</span>
        }
      </div>
      {profile
        ? <h3>Connections</h3>
        : <></>
      }
      <Suspense fallback={<Loader />}>
        <ProfileConnections loggedIn={(profile && profile.read()) ? true : false} />
      </Suspense>
      {profile && profile.read() &&
        <div className="QRCodeSection">
          <div className="QRCodeContainer">
            <div className="QRCode">
              <QRCode
                value={`${window.location.origin}/addcontact/${profile.read().id}`}
                renderAs="svg"
                size={160} />
            </div>
            <span>{profile.read().username}</span>
          </div>
        </div>
      }
    </>
  );
}

const Profile = ({ profile }) => {
  const [source, setSource] = useState();
  const [privateProfile, setPrivateProfile] = useState(profile ? profile.private : false);

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

  const onPrivacyChange = (checked) => {
    updatePrivacy(checked)
      .then((privateProfile) => setPrivateProfile(privateProfile))
      .catch(() => { });
  }

  return (
    <>
      <div className="ProfileInfo">
        <img alt="Avatar" src={source && source.read()} />
        <span>{profile.username}</span>
      </div>
      <div className="PrivacySettings">
        <Switch onChange={onPrivacyChange} checked={privateProfile} />
        <span>Private Profile</span>
      </div>
      <div className="UserIdentifier">
        <span>{profile.id}</span>
      </div>
    </>
  );
}

Node.propTypes = {
  profile: PropTypes.object.isRequired
}

export default ProfileSettings;
