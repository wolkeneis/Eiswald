import { Storage } from "@capacitor/storage";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { useDispatch, useSelector } from "react-redux";
import { setNodes } from "../../redux/contentSlice";
import "./Content.scss";
import EpisodeList from "./EpisodeList";
import PlaylistPreviews from "./PlaylistPreviews";

const Content = () => {
  const nodes = useSelector(state => state.content.nodes);
  const source = useSelector(state => state.content.source);
  const videoContainer = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    Storage.get({ key: "nodes" }).then(nodes => {
      if (nodes.value) {
        dispatch(setNodes(JSON.parse(nodes.value)));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (nodes) {
      Storage.set({ key: "nodes", value: JSON.stringify(nodes) });
    }
  }, [nodes]);

  return (
    <div className="Content">
      <div className="VideoArea">
        {source &&
          <div ref={videoContainer} className="VideoPlayer">
            <ReactPlayer
              className="react-player"
              url={source}
              width="100%"
              height=""
              controls
            />
            <div className="VideoControls">

            </div>
          </div>
        }
        <EpisodeList nodes={nodes ?? {}} />
      </div>
      <PlaylistPreviews nodes={nodes ?? {}} />
    </div>
  );
}

export default Content;
