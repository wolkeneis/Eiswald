import england from "../media/languages/england.svg";
import germany from "../media/languages/germany.svg";
import japan from "../media/languages/japan.svg";
import { wrapPromise } from "./utils";


const fetchPlaylists = (node) => {
  return fetch(node.origin + "/content/playlists/", {
    importance: "high",
    credentials: "include"
  });
}

function fetchThumbnail(node, key) {
  return wrapPromise(fetch(node.origin + "/content/thumbnail/" + key, {
    importance: "low",
    credentials: "include"
  })
    .then(response => response.blob())
    .then(image => URL.createObjectURL(image)));
}

function fetchPlaylist(node, key) {
  return fetch(node.origin + "/content/playlist/" + key, {
    importance: "high",
    credentials: "include"
  });
}

function fetchAvatar(avatar) {
  return wrapPromise(fetch(avatar, {
    importance: "low"
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
  return `${language}` === "0" ? germany : `${language}` === "1" ? japan : `${language}` === "2" ? england : undefined;
}

function languageAlt(language) {
  return `${language}`.split("-").length === 1
    ? [languageIndexAlt(`${language}`.split("-")[0])]
    : `${language}`.split("-").length === 2
      ? [languageIndexAlt(`${language}`.split("-")[0]), languageIndexAlt(`${language}`.split("-")[1])]
      : undefined;
}

function languageIndexAlt(language) {
  return `${language}` === "0" ? "German" : `${language}` === "1" ? "Japanese" : `${language}` === "2" ? "English" : undefined;
}

function seasonName(season) {
  return season === -1 ? undefined : season === 0 ? "Specials" : `Season ${season}`;
}

export { fetchPlaylists, fetchThumbnail, fetchPlaylist, fetchAvatar };
export { nodeStateClass, nodeStateText };
export { languageImage, languageAlt, seasonName };

