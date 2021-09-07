import england from "../media/languages/england.svg";
import germany from "../media/languages/germany.svg";
import japan from "../media/languages/japan.svg";

const fetchPlaylists = (node) => {
  return fetch(node.origin + "/playlists/", { importance: "high" });
}

function fetchThumbnail(node, key) {
  return wrapPromise(fetch(node.origin + "/thumbnail/" + key, { importance: "low" })
    .then(response => response.blob())
    .then(image => URL.createObjectURL(image)));
}

function fetchPlaylist(node, key) {
  return fetch(node.origin + "/playlist/" + key, { importance: "high" });
}

function fetchAvatar(avatar) {
  return wrapPromise(fetch(avatar, { importance: "low" })
    .then(response => response.blob())
    .then(image => URL.createObjectURL(image)));
}


function nodeStateClass(node) {
  return node && node.state ? (node.state.authenticated ? (node.state.profile && node.state.profile.authorized ? "available" : "unauthorized") : "unauthenticated") : "unavailable";
}

function nodeStateText(node) {
  return node && node.state ? (node.state.authenticated ? (node.state.profile && node.state.profile.authorized ? "Available" : "Unauthorized") : "Unauthenticated") : "Unavailable";
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


function wrapPromise(promise) {
  let status = 1;
  let result;
  let suspender = promise.then(
    (response) => {
      status = 0;
      result = response;
    },
    (error) => {
      status = 2;
      result = error;
    }
  );
  return {
    read() {
      if (status === 1) {
        throw suspender;
      } else if (status === 2) {
        throw result;
      } else if (status === 0) {
        return result;
      }
    }
  };
}

export { fetchPlaylists, fetchThumbnail, fetchPlaylist, fetchAvatar };
export { nodeStateClass, nodeStateText };
export { languageImage, languageAlt, seasonName };
export { wrapPromise };

