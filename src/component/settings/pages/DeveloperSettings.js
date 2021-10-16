import { Clipboard } from '@capacitor/clipboard';
import { Dialog } from '@capacitor/dialog';
import PropTypes from "prop-types";
import { Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createClient, fetchClient, fetchClients, regenerateSecret, updateClientName, updateRedirectUri } from "../../../logic/developer";
import { fetchProfile } from "../../../logic/profile";
import Loader from "../../Loader";
import "./DeveloperSettings.scss";

const DeveloperSettings = () => {
  const [profile, setProfile] = useState();
  const [clients, setClients] = useState();
  const [secrets, setSecrets] = useState({});
  const nameFieldRef = useRef();
  const redirectUriFieldRef = useRef();


  useEffect(() => {
    setProfile(fetchProfile());
    return () => {
      setProfile();
    }
  }, []);

  useEffect(() => {
    if (profile && profile.read()) {
      setClients(fetchClients());
      return () => {
        setClients();
      }
    }
  }, [profile]);

  const onClick = () => {
    const name = nameFieldRef.current.value;
    const refirectUri = redirectUriFieldRef.current.value;
    if (name && refirectUri) {
      createClient(name, refirectUri)
        .then((client) => {
          if (client.id && client.secret) {
            const newSecrets = {
              ...secrets
            }
            newSecrets[client.id] = client.secret;
            setSecrets(newSecrets);
            setClients(fetchClients());
          } else {
            Dialog.alert({
              title: "An error occurred",
              message: "Please try again later"
            });
          }
        });
    } else {
      Dialog.alert({
        title: "An error occurred",
        message: "Please try again later"
      });
    }
  }

  const generateNewSecret = (clientId) => {
    regenerateSecret(clientId)
      .then((client) => {
        if (client.id && client.secret) {
          const newSecrets = {
            ...secrets
          }
          newSecrets[client.id] = client.secret;
          setSecrets(newSecrets);
        } else {
          Dialog.alert({
            title: "An error occurred",
            message: "Please try again later"
          });
        }
      });
  }

  return (
    <>
      <h1>Developer Settings</h1>
      <p className="SecretInformation">
        the secret can only be displayed once, if you do not copy it you will have to generate a new one
      </p>
      {profile && profile.read()
        ? <>
          <div className="ClientCreator">
            <div className="ClientCreateContainer">
              <span>Create Client</span>
              <input aria-label="Client Name" placeholder="Name..." ref={nameFieldRef} type="text" />
              <input aria-label="Redirect URI" placeholder="Redirect URI..." ref={redirectUriFieldRef} type="text" />
              <AddButton onClick={onClick} />
            </div>
          </div>
          {clients && clients.read()
            ? <>
              {clients.read().map(client =>
                <Suspense key={client} fallback={<Loader />}>
                  <Client clientId={client} generateNewSecret={generateNewSecret} secret={secrets[client]} />
                </Suspense>
              )
              }
            </>
            : <Loader />
          }
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

const Client = ({ clientId, generateNewSecret, secret }) => {
  const [client, setClient] = useState();

  useEffect(() => {
    if (clientId) {
      setClient(fetchClient(clientId));
      return () => {
        setClient();
      }
    }
  }, [clientId]);

  const editName = () => {
    Dialog.prompt({
      title: 'Edit Client Name',
      message: `Enter the new Name`,
      inputPlaceholder: "Name...",
      inputText: (client && client.read()) ? client.read().name : ""
    })
      .then(({ value, cancelled }) => {
        if (!cancelled && value) {
          updateClientName(clientId, value)
            .then(() => setClient(fetchClient(clientId)))
            .catch(() =>
              Dialog.alert({
                title: "An error occurred",
                message: "Please try again later"
              }));
        }
      });
  }

  const editRedirectUri = () => {
    Dialog.prompt({
      title: 'Edit Client Redirect URI',
      message: `Enter the new Redirect URI`,
      inputPlaceholder: "Redirect URI...",
      inputText: (client && client.read()) ? client.read().redirectUri : ""
    })
      .then(({ value, cancelled }) => {
        if (!cancelled && value) {
          updateRedirectUri(clientId, value)
            .then(() => setClient(fetchClient(clientId)))
            .catch(() =>
              Dialog.alert({
                title: "An error occurred",
                message: "Please try again later"
              }));
        }
      });
  }

  const copySecret = () => {
    Clipboard.write({
      string: secret
    });
  }

  return (
    <>
      {client && client.read() &&
        <div className="Client">
          <div className="ClientContainer">
            <div className="ClientIdentification">
              <span>{clientId}</span>
            </div>
            <div className="ClientInformation">
              <span>{client.read().name}</span>
              <button aria-label="Edit Name" className="EmojiButton" onClick={editName}>✎</button>
            </div>
            <div className="ClientInformation">
              <span>{client.read().redirectUri}</span>
              <button aria-label="Edit Redirect URI" className="EmojiButton" onClick={editRedirectUri}>✎</button>
            </div><div className="ClientInformation">
              {secret
                ? <>
                  <span>{secret}</span>
                  <button aria-label="Copy Secret" className="EmojiButton" onClick={copySecret}>📋</button>
                </>
                : <>
                  <span>Secret</span>
                  <button aria-label="Regenerate Secret" className="EmojiButton" onClick={() => generateNewSecret(clientId)}>↺</button>
                </>
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

Client.propTypes = {
  clientId: PropTypes.string.isRequired,
  generateNewSecret: PropTypes.func.isRequired,
  secret: PropTypes.string
}

const AddButton = ({ onClick }) => {
  return (
    <button aria-label="Add Node" className="AddButton" onClick={onClick}>✓</button>
  );
}

AddButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default DeveloperSettings;
