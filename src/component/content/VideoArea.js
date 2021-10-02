import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { useDispatch, useSelector } from "react-redux";
import { requestSync, sync } from "../../logic/connection";
import { isElementInViewport } from "../../logic/utils";
import { pause, play, setDuration, setLoaded, setPlayed, setSource, setTime } from "../../redux/playerSlice";
import useInterval from "../useInterval";
import EpisodeList from "./EpisodeList";
import RoomControls from "./RoomControls";
import "./VideoArea.scss";
import VideoControls from "./VideoControls";
import { isTouchDevice } from "../../logic/utils";

const VideoArea = () => {
  const [controlsVisible, setControlsVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const native = useSelector(state => state.interface.native);
  const nodes = useSelector(state => state.content.nodes);
  const playlistPreviews = useSelector(state => state.content.playlistPreviews);
  const selectedEpisode = useSelector(state => state.content.episode);
  const source = useSelector(state => state.player.source);
  const volume = useSelector(state => state.player.volume);
  const playing = useSelector(state => state.player.playing);
  const time = useSelector(state => state.player.time);
  const roomId = useSelector(state => state.room.roomId);
  const host = useSelector(state => state.room.host);
  const dispatch = useDispatch();
  const videoContainer = useRef();
  const videoWrapper = useRef();
  const videoPlayer = useRef();
  const idle = useRef(0);
  const moved = useRef(false);
  const inside = useRef(false);

  useInterval(() => {
    if (moved.current || !playing) {
      if (!controlsVisible && inside.current) {
        setControlsVisible(true);
        idle.current = 0;
      }
    } else {
      if (controlsVisible) {
        idle.current = idle.current + 500;
      }
    }
    if (idle.current >= (native || isTouchDevice() ? 3500 : 2500)) {
      setControlsVisible(false);
      idle.current = 0;
    }
    moved.current = false;
  }, 500);

  useEffect(() => {
    window.addEventListener("resize", () => {
      calculateHeight();
    });
  }, []);

  useEffect(() => {
    if (playlistPreviews && selectedEpisode) {
      const playlist = playlistPreviews.find(playlist => playlist.key === selectedEpisode.playlist);
      dispatch(setSource(playlist ? `${playlist.node}/content/source/${playlist.key}/${selectedEpisode.key}` : undefined));
    }
  }, [playlistPreviews, selectedEpisode, dispatch]);

  useEffect(() => {
    if (source && videoContainer && !isElementInViewport(videoContainer.current)) {
      videoContainer.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [source]);

  useEffect(() => {
    if (videoPlayer.current) {
      const currentTime = videoPlayer.current.getCurrentTime();
      if (currentTime > time + 0.2 || currentTime < time - 0.2) {
        videoPlayer.current.seekTo(time, "seconds");
        idle.current = 0;
      }
    }
  }, [time]);

  const calculateHeight = () => {
    if (videoWrapper.current) {
      videoWrapper.current.style.height = `${videoWrapper.current.offsetWidth / (16 / 9)}px`;
    }
  }

  const showControls = () => {
    idle.current = 0;
    inside.current = true;
    setControlsVisible(true);
  }

  const hideControls = () => {
    idle.current = 0;
    inside.current = false;
    if (playing) {
      setControlsVisible(false);
    }
  }

  const playPause = () => {
    if (controlsVisible) {
      dispatch(play(!playing));
      sync();
    } else {
      showControls();
    }
  }

  const onDuration = (duration) => {
    dispatch(setDuration(duration));
    if (time > 0) {
      videoPlayer.current.seekTo(time, "seconds");
    }
  }

  const onError = () => {
    if (muted) {
      dispatch(setTime(0));
      dispatch(setDuration(0));
      dispatch(setPlayed(0));
      dispatch(setLoaded(0));
      dispatch(pause());
    } else {
      setMuted(true);
    }
  }

  return (
    <div className={`VideoArea ${native ? "native" : ""}`}>
      {source &&
        <div ref={videoContainer} className={`VideoPlayer ${native ? "native" : ""}`}>
          <div id="video-wrapper" ref={videoWrapper}
            style={controlsVisible ? {} : { cursor: "none" }}
            onMouseEnter={showControls}
            onMouseLeave={hideControls}
            onMouseMove={() => moved.current = true} className="VideoWrapper"
          >
            <ReactPlayer
              className="react-player"
              ref={videoPlayer}
              url={source}
              width="100%"
              height="100%"
              muted={muted}
              playing={playing}
              volume={volume}
              progressInterval={500}
              onReady={() => {
                calculateHeight();
                if (roomId && !host) {
                  setTimeout(() => {
                    requestSync();
                  }, 1000);
                }
              }}
              onProgress={(event) => {
                dispatch(setTime(event.playedSeconds));
                dispatch(setPlayed(event.played));
                dispatch(setLoaded(event.loaded));
              }}
              onDuration={onDuration}
              onError={onError}
            />
            <div className="ClickControl" onClick={playPause} />
            <VideoControls visible={controlsVisible} muted={muted} unmute={() => setMuted(false)} />
          </div>
          <RoomControls />
        </div>
      }
      <EpisodeList nodes={nodes ?? {}} />
    </div>
  );
}

export default VideoArea;
