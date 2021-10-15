import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import E2E from "e2e-encryption";
import forge from "node-forge";
import { io } from "socket.io-client";
import { decodeBase64, encodeBase64 } from "tweetnacl-util";
import { setPacket, setPrivateKey, setProfile, setPublicKey, setUser } from "../redux/socialSlice";
import store from "../redux/store";
import { wrapPromise } from "./utils";

const socket = io((process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev") + "/chat", { withCredentials: true });

socket.on("packet", (encryptedPacket) => {
  const profile = store.getState().social.profile;
  if (profile) {
    decrypt(encryptedPacket).then(packet => {
      if (packet) {
        store.dispatch(setPacket(packet));
      }
    });
  }
});

function fetchPackets(start, range) {
  socket.emit("packets", {
    start: start,
    range: range
  }, packets => {
    if (!packets) {
      throw new Error("No messages received!");
    }
    for (let i = 0; i < packets.length; i++) {
      const encryptedPacket = packets[i];
      decrypt(encryptedPacket).then(packet => {
        if (packet) {
          store.dispatch(setPacket(packet));
        }
      });
    }
  });
}

function sendPacket(message, receiver) {
  accessible(receiver).then(accessible => {
    if (accessible) {
      encrypt(message, receiver).then(packet => {
        socket.emit("packet", packet, (encryptedPacket) => {
          decrypt(encryptedPacket).then(packet => {
            if (packet) {
              store.dispatch(setPacket(packet));
            }
          });
        });
      });
    }
  });
}

var encryptionInstance;

function initializeKeys() {
  SecureStoragePlugin.keys().then(keys => {
    if (keys.value.includes("keyPair") || keys.value.includes("cap_sec_keyPair")) {
      SecureStoragePlugin.get({
        key: "keyPair"
      }).then(keyPair => JSON.parse(keyPair.value))
        .then(keyPair => {
          store.dispatch(setPrivateKey(keyPair.privateKey));
          store.dispatch(setPublicKey(keyPair.publicKey));
          encryptionInstance = new E2E(keyPair.publicKey, keyPair.privateKey, {});
        });
    }
  });
}

function storeKeyPair(keyPair) {
  SecureStoragePlugin.set({
    key: "keyPair",
    value: JSON.stringify(keyPair)
  });
}

function generateKeys(password) {
  return new Promise((resolve) => {
    encryptionInstance = new E2E("", "", {});
    store.dispatch(setPrivateKey(encryptionInstance.privateKey));
    store.dispatch(setPublicKey(encryptionInstance.publicKey));
    const encryptedPrivateKey = encryptPrivateKey(encryptionInstance.privateKey, password);
    const encryptedKeyPair = { ...encryptedPrivateKey, publicKey: encryptionInstance.publicKey };
    SecureStoragePlugin.keys().then(keys => {
      if (keys.value.includes("keyPair")) {
        SecureStoragePlugin.remove({
          key: "keyPair"
        });
      }
    });
    uploadKeyPair(encryptedKeyPair);
    return resolve({
      privateKey: encryptionInstance.privateKey,
      publicKey: encryptionInstance.publicKey
    });
  });
}

async function decryptKeyPair(encryptedKeyPair, password) {
  return new Promise((resolve, reject) => {
    const keyPair = decryptPrivateKey(encryptedKeyPair, password);
    if (!keyPair) {
      return reject();
    }
    encryptionInstance = new E2E(keyPair.publicKey, keyPair.privateKey, {});
    store.dispatch(setPrivateKey(keyPair.privateKey));
    store.dispatch(setPublicKey(keyPair.publicKey));
    return resolve(keyPair);
  });
}

function fetchProfile() {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile`, {
    method: "POST",
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json())
    .then(profile => {
      store.dispatch(setProfile(profile));
    })
    .catch(() => { });
}

function fetchUserProfile(userId) {
  const users = store.getState().social.users;
  if (Object.keys(users).includes(userId)) {
    return users[userId];
  } else {
    return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/api/user/${userId}/profile`, {
      credentials: "include",
      redirect: "manual"
    }))
      .then(response => response.json())
      .then(profile => {
        profile.packets = {};
        store.dispatch(setUser(profile));
        return profile;
      })
      .catch(() => { });
  }
}

function fetchContacts() {
  const users = store.getState().social.users;
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/contacts`, {
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json())
    .then(contacts => {
      for (const contact of contacts) {
        if (!Object.keys(users).includes(contact)) {
          fetchUserProfile(contact);
        }
      }
    })
    .catch(() => { });
}

function fetchAvatar(avatar) {
  return wrapPromise(fetch(new Request(avatar, {
    importance: "low",
    redirect: "manual"
  }))
    .then(response => response.blob())
    .then(image => URL.createObjectURL(image)));
}

async function accessible(userId) {
  const state = store.getState();
  if (state.social.users[userId]) {
    return state.social.users[userId].username !== undefined;
  } else {
    const profile = await fetchUserProfile(userId);
    return profile.username !== undefined;
  }
}

async function publicKey(userId) {
  const state = store.getState();
  if (state.social.users[userId]) {
    return state.social.users[userId].publicKey;
  } else {
    const profile = await fetchUserProfile(userId);
    return profile.publicKey;
  }
}

async function encrypt(message, receiver) {
  try {
    return {
      receiver: receiver,
      content: encryptionInstance.Encrypt({ message: message, date: Date.now() }, await publicKey(receiver), {})
    };
  } catch {
    return undefined;
  }
}

async function decrypt(encryptedPacket) {
  const userId = store.getState().social.profile.id;
  const otherUser = encryptedPacket.receiver !== userId ? encryptedPacket.receiver : encryptedPacket.sender;
  try {
    const packet = encryptionInstance.Decrypt(encryptedPacket.content, await publicKey(otherUser), {})
    packet.sender = encryptedPacket.sender === userId;
    packet.userId = otherUser;
    packet.packetId = encryptedPacket.packetId;
    return packet;
  } catch {
    return undefined;
  }
}

function uploadKeyPair(keyPair) {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/key`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(keyPair)
  }));
}

function fetchKeyPair() {
  return wrapPromise(fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/key`, {
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json())
    .then(encryptedKeyPair => encryptedKeyPair));
}

function encryptPrivateKey(privateKey, password) {
  var iv = forge.random.getBytesSync(32);
  var salt = forge.random.getBytesSync(128);
  var key = forge.pkcs5.pbkdf2(password, salt, 120000, 32);
  var cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(privateKey));
  cipher.finish();
  const encryptedPrivateKey = cipher.output.getBytes();
  return {
    iv: encode64(iv),
    salt: encode64(salt),
    privateKey: encode64(encryptedPrivateKey)
  }

}

function decryptPrivateKey(keyPair, password) {
  if (!keyPair || !keyPair.iv || !keyPair.salt || !keyPair.privateKey || !keyPair.publicKey) {
    return undefined;
  }
  const iv = decode64(keyPair.iv);
  const salt = decode64(keyPair.salt);
  const encryptedPrivateKey = decode64(keyPair.privateKey);
  var key = forge.pkcs5.pbkdf2(password, salt, 120000, 32);
  var decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(encryptedPrivateKey));
  var result = decipher.finish();
  if (!result) {
    return undefined;
  }
  return {
    privateKey: decipher.output.getBytes(),
    publicKey: keyPair.publicKey
  };
}

function encode64(bytes) {
  return encodeBase64(Buffer.from(bytes));
}

function decode64(base64) {
  return Buffer.from(decodeBase64(base64)).toString();
}

export { initializeKeys, generateKeys, decryptKeyPair, fetchKeyPair, storeKeyPair, fetchProfile, fetchPackets, fetchContacts, fetchAvatar, sendPacket };

