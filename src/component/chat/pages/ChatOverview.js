import PropTypes from "prop-types";
import { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { fetchAvatar, fetchContacts, fetchPackets, fetchProfile } from "../../../logic/signal";
import addContactIcon from "../../../media/invite.svg";
import IconLink from "../../IconLink";
import Loader from "../../Loader";
import "./ChatOverview.scss";

const ChatOverview = () => {
  const users = useSelector(state => state.social.users);
  const privateKey = useSelector(state => state.social.publicKey);

  useEffect(() => {
    if (privateKey) {
      fetchProfile().then(() => {
        fetchContacts().then(() => {
          setTimeout(() => {
            fetchPackets();
          }, 250);
        });
      });
    }
  }, [privateKey]);

  return (
    <>
      {privateKey
        ? <>
          <h1>Chats</h1>
          {users && Object.keys(users).map(userId => {
            const user = users[userId];
            return (
              <Suspense key={user.id} fallback={<Loader />}>
                <UserProfile profile={user} />
              </Suspense>
            );
          })}
          <AddContactButton />
        </>
        : <Redirect to="/chat/authenticate" />
      }
    </>
  );
}

const UserProfile = ({ profile }) => {
  const [source, setSource] = useState();

  useEffect(() => {
    if (profile.avatar) {
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
    <Link
      aria-label={profile.username}
      className="UserProfile"
      to={`/chat/${profile.id}`}>
      {profile.avatar &&
        < img alt="Avatar" src={source && source.read()} />
      }
      <span>{profile.username ? profile.username : profile.id}</span>
    </Link>
  );
}

UserProfile.propTypes = {
  profile: PropTypes.object.isRequired
}

const AddContactButton = () => {
  return (
    <div className="AddContact">
      <IconLink linkName="Add Contact" imageAlt="Add Contact Icon" imageSource={addContactIcon} destination="/settings/contacts" />
    </div>
  );
}


export default ChatOverview;
