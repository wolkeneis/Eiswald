import discordIcon from "../media/discord.svg";
import githubIcon from "../media/github.png";
import { wrapPromise } from "./utils";


const providers = [
  {
    id: "discord",
    name: "Discord",
    icon: discordIcon
  },
  {
    id: "github",
    name: "Github",
    icon: githubIcon
  },
];

function fetchAvatar(avatar) {
  return wrapPromise(fetch(new Request(avatar, {
    importance: "low",
    redirect: "manual"
  }))
    .then(response => response.blob())
    .then(image => URL.createObjectURL(image)));
}

function fetchProfile() {
  return wrapPromise(fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile`, {
    method: "POST",
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json())
    .then(profile => profile)
    .catch(() => { }));
}

function updatePrivacy(privateProfile) {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/privacy`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      private: privateProfile
    })
  }))
    .then(response => response.json())
    .then(profile => profile.private);
}

function fetchProfileConnections() {
  return wrapPromise(fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/connections`, {
    method: "POST",
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json())
    .then(connections => connections)
    .catch(() => { }));
}



export { providers };
export { fetchAvatar, fetchProfile, fetchProfileConnections, updatePrivacy };

