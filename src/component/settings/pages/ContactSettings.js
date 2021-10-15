import PropTypes from "prop-types";
import { Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { addContact, fetchAvatar, fetchContacts, fetchUserProfile, removeContact } from "../../../logic/contacts";
import addContactIcon from "../../../media/invite.svg";
import IconButton from "../../IconButton";
import Loader from "../../Loader";
import "./ContactSettings.scss";

const ContactSettings = () => {
  const [contacts, setContacts] = useState();

  useEffect(() => {
    setContacts(fetchContacts());
    return () => {
      setContacts();
    }
  }, []);

  const reloadContacts = () => {
    setContacts(fetchContacts());
  }

  return (
    <>
      <h1>Contacts</h1>
      {contacts && contacts.read()
        ?
        <>
          <AddContactField reloadContacts={reloadContacts} />
          {contacts.read().map(contact =>
            <Suspense key={contact} fallback={<Loader />}>
              <Contact userId={contact} reloadContacts={reloadContacts} />
            </Suspense>)}
        </>
        : <div className="ProfileRedirect">
          <h3>You're not logged in</h3>
          <Link
            aria-label="Sign in"
            className="ProfileSettingsButton"
            to={"/settings/profile"}>
            Sign in
          </Link>
        </div>
      }
    </>
  );
}

const AddContactField = ({ reloadContacts }) => {
  const userIdField = useRef();

  const onKeyPress = (event) => {
    if (event.key === "Enter" && userIdField.current.value) {
      addContact(userIdField.current.value).then(reloadContacts).catch(() => { });
      userIdField.current.value = "";
    }
  }

  const onClick = () => {
    if (userIdField.current.value) {
      addContact(userIdField.current.value).then(reloadContacts).catch(() => { });
      userIdField.current.value = "";
    }
  }

  return (
    <div className="AddContactField">
      <input ref={userIdField} aria-label="User Id" placeholder="User Id..." type="text" onKeyPress={onKeyPress} />
      <IconButton buttonName="Add Contact" imageAlt="Add Contact Icon" imageSource={addContactIcon} onClick={onClick} />
    </div>
  );
}

AddContactField.propTypes = {
  reloadContacts: PropTypes.func.isRequired
}

const Contact = ({ userId, reloadContacts }) => {
  const [profile, setProfile] = useState();
  const [source, setSource] = useState();

  useEffect(() => {
    setProfile(fetchUserProfile(userId));
    return () => {
      setProfile();
    }
  }, [userId]);

  useEffect(() => {
    if (profile && profile.read().avatar) {
      setSource(fetchAvatar(profile && profile.read().avatar));
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

  const onClick = () => {
    removeContact(userId).then(reloadContacts).catch(() => { });
  }

  return (
    <div className="Contact">
      {profile && profile.read().avatar &&
        <img alt="Avatar" src={source && source.read()} />
      }
      <span>{profile && (profile.read().username ? profile.read().username : profile.read().id)}</span>
      <button aria-label="Remove Contact" className="RemoveContact" onClick={onClick}>×</button>
    </div>
  );
}

Contact.propTypes = {
  userId: PropTypes.string.isRequired,
  reloadContacts: PropTypes.func.isRequired
}

export default ContactSettings;
