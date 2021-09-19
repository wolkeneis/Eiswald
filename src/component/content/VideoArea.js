import { useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { useSelector } from "react-redux";
import EpisodeList from "./EpisodeList";
import "./VideoArea.scss";

const VideoArea = () => {
  const nodes = useSelector(state => state.content.nodes);
  const source = useSelector(state => state.content.source);
  const videoContainer = useRef();

  return (
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
  );
}

export default VideoArea;
