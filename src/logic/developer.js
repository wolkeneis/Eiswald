import { wrapPromise } from "./utils";

function fetchClients() {
  return wrapPromise(fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/profile/clients`, {
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json())
    .then(clients => clients)
    .catch(() => []));
}

function fetchClient(clientId) {
  return wrapPromise(fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/api/client/${clientId}`, {
    credentials: "include",
    redirect: "manual"
  }))
    .then(response => response.json())
    .then(client => client)
    .catch(() => { }));
}

function createClient(name, redirectUri) {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/api/client/create`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      redirectUri: redirectUri
    })
  }))
    .then(response => response.json())
    .then(client => client)
    .catch(() => { });
}

function updateClientName(clientId, name) {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/api/client/${clientId}/name`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name
    })
  }));
}

function updateRedirectUri(clientId, redirectUri) {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/api/client/${clientId}/redirectUri`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      redirectUri: redirectUri
    })
  }));
}

function regenerateSecret(clientId) {
  return fetch(new Request(`${process.env.REACT_APP_WALDERDE_NODE || "https://walderde.wolkeneis.dev"}/api/client/${clientId}/secret`, {
    method: "POST",
    credentials: "include",
    redirect: "manual",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({})
  }))
    .then(response => response.json())
    .then(client => client)
    .catch(() => { });
}

export { fetchClients, fetchClient, createClient, updateClientName, updateRedirectUri, regenerateSecret };

