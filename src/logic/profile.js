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



export { providers };
export { fetchAvatar };

