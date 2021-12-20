import englandIcon from "../media/languages/england.svg";
import germanyIcon from "../media/languages/germany.svg";
import japanIcon from "../media/languages/japan.svg";
import chinaIcon from "../media/languages/china.svg";
import { wrapPromise } from "./utils";

const fetchNodeState = (origin) => {
  return fetch(new Request(origin, {
    redirect: "manual"
  }))
    .then(response => response.json());
}

const fetchNodeProfile = (origin) => {
  return fetch(new Request(`${origin}/profile`, {
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json());
}

const fetchPlaylists = (node) => {
  return fetch(node.origin + "/content/playlists/", {
    importance: "high",
    credentials: "include",
    redirect: "manual"
  });
}

function fetchThumbnail(node, key) {
  return wrapPromise(fetch(node.origin + "/content/thumbnail/" + key, {
    importance: "low",
    credentials: "include",
    redirect: "manual"
  })
    .then(response => response.blob())
    .then(image => URL.createObjectURL(image)));
}

function fetchPlaylist(node, key) {
  return fetch(node.origin + "/content/playlist/" + key, {
    importance: "high",
    credentials: "include",
    redirect: "manual"
  });
}

function fetchAvatar(avatar) {
  return wrapPromise(fetch(avatar, {
    importance: "low",
    redirect: "manual"
  })
    .then(response => response.blob())
    .then(image => URL.createObjectURL(image)));
}


function nodeStateClass(node) {
  return node && node.state ? (node.state === "maintenance" ? "maintenance" : (node.profile ? (node.profile.authorized ? "available" : "unauthorized") : "unauthenticated")) : "unavailable";
}

function nodeStateText(node) {
  return node && node.state ? (node.state === "maintenance" ? "Maintenance" : (node.profile ? (node.profile.authorized ? "Available" : "Unauthorized") : "Unauthenticated")) : "Unavailable";
}


function languageImage(language) {
  return `${language}`.split("-").length === 1
    ? [languageIndexImage(`${language}`.split("-")[0])]
    : `${language}`.split("-").length === 2
      ? [languageIndexImage(`${language}`.split("-")[0]), languageIndexImage(`${language}`.split("-")[1])]
      : undefined;
}

function languageIndexImage(language) {
  return `${language}` === "0" ? germanyIcon : `${language}` === "1" ? japanIcon : `${language}` === "2" ? englandIcon : `${language}` === "3" ? chinaIcon : undefined;
}

function languageAlt(language) {
  return `${language}`.split("-").length === 1
    ? [languageIndexAlt(`${language}`.split("-")[0])]
    : `${language}`.split("-").length === 2
      ? [languageIndexAlt(`${language}`.split("-")[0]), languageIndexAlt(`${language}`.split("-")[1])]
      : undefined;
}

function languageIndexAlt(language) {
  return `${language}` === "0" ? "German" : `${language}` === "1" ? "Japanese" : `${language}` === "2" ? "English" : `${language}` === "3" ? "Chinese" : undefined;
}

function seasonName(season) {
  return season === -1 ? undefined : season === 0 ? "Specials" : `Season ${season}`;
}

export { fetchNodeState, fetchNodeProfile, fetchPlaylists, fetchThumbnail, fetchPlaylist, fetchAvatar };
export { nodeStateClass, nodeStateText };
export { languageImage, languageAlt, seasonName };

