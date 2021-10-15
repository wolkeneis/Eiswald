import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { fetchProfile } from "../../../logic/profile";
import { decryptKeyPair, fetchKeyPair, generateKeys, storeKeyPair } from "../../../logic/signal";
import Loader from "../../Loader";
import "./PrivateKey.scss";

const PrivateKey = () => {
  const [profile, setProfile] = useState();
  const [encryptedKeyPair, setEncryptedKeyPair] = useState();
  const [working, setWorking] = useState(false);
  const [password, setPassword] = useState();
  const [strength, setStrength] = useState(0);
  const [suggestions, setSuggestions] = useState();
  const [warning, setWarning] = useState();
  const [safeCredentials, setSafeCredentials] = useState(false);
  const privateKey = useSelector(state => state.social.privateKey);
  const native = useSelector(state => state.interface.native);
  const history = useHistory();

  useEffect(() => {
    setProfile(fetchProfile());
    return () => {
      setProfile();
    }
  }, []);

  useEffect(() => {
    if (profile && profile.read()) {
      if (!privateKey) {
        try {
          setEncryptedKeyPair(fetchKeyPair());
        } catch (error) {
          console.log(error);
        }
      } else {
        history.push("/chat");
      }
    }
  }, [privateKey, profile, history]);

  const privateKeyExists = () => {
    return encryptedKeyPair &&
      encryptedKeyPair.read() &&
      encryptedKeyPair.read().iv &&
      encryptedKeyPair.read().salt &&
      encryptedKeyPair.read().privateKey &&
      encryptedKeyPair.read().publicKey;
  }

  const createNewPassword = () => {
    setWorking(true);
    setTimeout(() => {
      import("zxcvbn")
        .then(zxcvbn => zxcvbn.default)
        .then(zxcvbn => {
          const result = zxcvbn(password);
          if (result.score >= 3) {
            generateKeys(password).then(keyPair => {
              if ((native || safeCredentials) && keyPair) {
                storeKeyPair(keyPair);
              }
              setWorking(false);
            });
          } else {
            setWorking(false);
          }
        });
    }, 250);
  }

  const decrypt = () => {
    setWarning();
    setWorking(true);
    setTimeout(() => {
      decryptKeyPair(encryptedKeyPair.read(), password)
        .then(keyPair => {
          if ((native || safeCredentials) && keyPair) {
            storeKeyPair(keyPair);
          }
          setWorking(false);
        })
        .catch(() => {
          setWorking(false);
          setWarning("Incorrect login information. try again");
        });
    }, 250);
  }

  const onChange = (event) => {
    setPassword(event.target.value);
    if (!privateKeyExists() && password) {
      import("zxcvbn")
        .then(zxcvbn => zxcvbn.default)
        .then(zxcvbn => {
          const result = zxcvbn(password);
          setSuggestions(result.feedback.suggestions);
          setWarning(result.feedback.warning);
          setStrength(result.score);
        });
    }
  }

  const onClick = () => {
    if (!privateKeyExists()) {
      createNewPassword();
    } else {
      decrypt();
    }
  }

  const onKeyPress = (event) => {
    if (event.key === "Enter" && password) {
      if (!privateKeyExists()) {
        createNewPassword();
      } else {
        decrypt();
      }
    }
  }

  return (
    <div className="PrivateKey">
      {profile && profile.read()
        ? privateKeyExists()
          ? <>
            <h1>End to End Encryption</h1>
            <p>Please enter your password to decrypt your private encryption key.</p>
            <div className="Credentials">
              <input type="checkbox" id="safe-credentials" name="Save Credentials" onChange={(event) => setSafeCredentials(event.target.value)} />
              <label htmlFor="safe-credentials">Save credentials (not recommended)</label>
            </div>
            <div className="Decrypt">
              <input className="DecryptionPasswordField" type="password" name="Decrypt Password" placeholder="Password..." onChange={onChange} onKeyPress={onKeyPress} />
              <button aria-label="Decrypt Private Key" className="DecryptButton" onClick={onClick}>Decrypt</button>
            </div>
            {warning &&
              <span className="Warning">{warning}</span>
            }
            {working && <Loader />}
            <p style={{ color: "var(--color-font-hover)" }}>
              If you have forgotten your password or are incorrectly asked
              to enter a password although you have not yet created one,
              you can also set a new password.
              Warning: if you have already written messages, they will be deleted
            </p>
            <button aria-label="Forgot Password" className="ForgotPasswordButton" onClick={() => setEncryptedKeyPair(null)}>Set new Password</button>
          </>
          : <>
            <h1>End to End Encryption</h1>
            <p>
              Please enter a password to encrypt your private encryption key
              which will keep your messages private.
              Warning: If you forget your password, you will not be able to recover your messages!
            </p>
            <span></span>
            <div className="Credentials">
              <input type="checkbox" id="safe-credentials" name="Save Credentials" onChange={(event) => setSafeCredentials(event.target.value)} />
              <label htmlFor="safe-credentials">Save credentials (not recommended)</label>
            </div>
            <div className="Encrypt">
              <input className={`EncryptionPasswordField ${password ? `strength-${strength}` : ""}`} type="password" name="Encrypt Password" placeholder="Password..." onChange={onChange} onKeyPress={onKeyPress} />
              <button aria-label="Encrypt Private Key" className="EncryptButton" onClick={onClick}>Encrypt</button>
            </div>
            {warning &&
              <span className="Warning">{warning}</span>
            }
            {suggestions &&
              suggestions.map(suggestion => <span key={suggestion} className="Suggestion">{suggestion}</span>)
            }
            {working && <Loader />}
            <p style={{ color: "var(--color-font-hover)" }}>
              If you've already set a password but you see this page,
              you don't want to reset your key and any messages with it.
              Please reload the page and try again
            </p>
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
    </div>
  );
}

PrivateKey.propTypes = {

}

export default PrivateKey;
