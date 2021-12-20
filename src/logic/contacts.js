import { setUser } from "../redux/socialSlice";
import store from "../redux/store";
import { wrapPromise } from "./utils";

function fetchContacts() {
  return wrapPromise(fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/contacts`, {
    method: "POST",
    credentials: "include"
  }))
    .then(response => response.json())
    .then(contacts => contacts)
    .catch(() => { }));
}

function fetchUserProfile(userId) {
  return wrapPromise(fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/api/user/${userId}/profile`, {
    method: "POST",
    credentials: "include"
  }))
    .then(response => response.json())
    .then(profile => {
      profile.packets = {};
      store.dispatch(setUser(profile));
      return profile;
    })
    .catch(() => { }));
}

function fetchAvatar(avatar) {
  return wrapPromise(fetch(new Request(avatar, {
    importance: "low",
    redirect: "manual"
  }))
    .then(response => response.blob())
    .then(image => URL.createObjectURL(image)));
}

function addContact(userId) {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/addcontact`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contactId: userId
    })
  }));
}

function removeContact(userId) {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/removecontact`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contactId: userId
    })
  }));
}

export { fetchContacts, fetchUserProfile, fetchAvatar, addContact, removeContact };

