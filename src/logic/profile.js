import discord from "../media/discord.svg";
import github from "../media/github.png";
import { wrapPromise } from "./utils";


const providers = [
  {
    id: "discord",
    name: "Discord",
    icon: discord
  },
  {
    id: "github",
    name: "Github",
    icon: github
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
    .then(profile => profile));
}

function fetchProfileConnections() {
  return wrapPromise(fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/connections`, {
    method: "POST",
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json())
    .then(connections => connections));
}



export { providers };
export { fetchAvatar, fetchProfile, fetchProfileConnections };

