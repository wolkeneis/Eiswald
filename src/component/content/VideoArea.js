import { Share } from "@capacitor/share";
import { useDrag } from "@use-gesture/react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { useDispatch, useSelector } from "react-redux";
import { leaveRoom, requestSync, sync } from "../../logic/connection";
import { clamp, isElementInViewport } from "../../logic/utils";
import addIcon from "../../media/add.svg";
import exitFullscreenIcon from "../../media/exit-fullscreen.svg";
import fullscreenIcon from "../../media/fullscreen.svg";
import inviteIcon from "../../media/invite.svg";
import leaveIcon from "../../media/leave.svg";
import nextIcon from "../../media/next.svg";
import pauseIcon from "../../media/pause.svg";
import playIcon from "../../media/play-filled.svg";
import previousIcon from "../../media/previous.svg";
import volumeIcon from "../../media/volume.svg";
//import pipIcon from "../../media/pip.svg";
import { setEpisode } from "../../redux/contentSlice";
import { pause, play, setDuration, setLoaded, setPlayed, setSource, setTime, setVolume } from "../../redux/playerSlice";
import IconButton from "../IconButton";
import useInterval from "../useInterval";
import EpisodeList from "./EpisodeList";
import "./VideoArea.scss";

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
    if (idle.current >= (native ? 3500 : 2500)) {
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
    if (playlistPreviews && selectedEpisode && !source) {
      const playlist = playlistPreviews.find(playlist => playlist.key === selectedEpisode.playlist);
      dispatch(setSource(playlist ? `${playlist.node}/content/source/${playlist.key}/${selectedEpisode.key}` : undefined));
    }
  }, [playlistPreviews, selectedEpisode, source, dispatch]);

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

  const onError = (error, error2) => {
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

const RoomControls = () => {
  const native = useSelector(state => state.interface.native);
  const roomId = useSelector(state => state.room.roomId);
  const mode = useSelector(state => state.room.mode); //SHOW MODE SWITCHER
  const host = useSelector(state => state.room.host); //ALLOW PROMOTING
  const users = useSelector(state => state.room.users);
  const dispatch = useDispatch();
  const sourceSelector = useRef();

  const invite = () => {
    Share.share({
      title: "Eiswald Room",
      text: "Join my Eiswald room",
      url: `${window.location.origin}/invite/${roomId}`,
      dialogTitle: "Share with friends",
    });
  }

  const leave = () => {
    leaveRoom();
  }

  const selectSource = (event) => {
    dispatch(setEpisode(undefined));
    dispatch(setSource(sourceSelector.current.value));
    dispatch(setTime(0));
    dispatch(play());
    sync();
  }

  return (
    <>
      {roomId &&
        <div className={`RoomControls ${native ? "native" : ""}`}>
          <div className="Buttons">
            <div className="HorizontalBox">
              <div className="InviteButton">
                <IconButton buttonName="Invite" imageAlt="Invite Icon" imageSource={inviteIcon} onClick={invite} />
                <span onClick={invite}>Invite</span>
              </div>
              <div className="LeaveButton">
                <IconButton buttonName="Leave" imageAlt="Leave Icon" imageSource={leaveIcon} onClick={leave} />
                <span onClick={leave}>Leave</span>
              </div>
            </div>
            {(host || mode !== "strict") &&
              <div className="HorizontalBox">
                <input aria-label="Source URL" ref={sourceSelector} type="text" placeholder="Source URL..." />
                <div className="AddButton">
                  <IconButton buttonName="Select Source" imageAlt="Select Source Icon" imageSource={addIcon} onClick={selectSource} />
                </div>
              </div>
            }
          </div>
          <div className="Users">
            {Object.keys(users).map(userId =>
              <div key={userId} className={`User ${users[userId].host ? "host" : ""}`}>
                <span>{users[userId].name}</span>
              </div>
            )}
          </div>
        </div>
      }
    </>
  )
}


const VideoControls = ({ visible, muted, unmute }) => {
  const native = useSelector(state => state.interface.native);

  const duration = useSelector(state => state.player.duration);
  const time = useSelector(state => state.player.time);
  const playing = useSelector(state => state.player.playing);

  const playlists = useSelector(state => state.content.playlists);
  const selectedEpisode = useSelector(state => state.content.episode);

  const dispatch = useDispatch();

  const playlist = selectedEpisode && playlists[selectedEpisode.playlist];

  const findEpisode = (offset) => {
    const season = playlist.seasons.find(season => season.language === selectedEpisode.language && season.index === selectedEpisode.season);
    if (!season) {
      return false;
    }
    const foundEpisode = season.episodes.find(episode => episode.key === selectedEpisode.key);
    if (!foundEpisode) {
      return false;
    }
    return season.episodes.find(episode => episode.index === foundEpisode.index + offset);
  }

  const previousEpisode = selectedEpisode && playlist && findEpisode(-1);

  const nextEpisode = selectedEpisode && playlist && findEpisode(1);

  return (
    <div className="VideoControls" style={visible || muted ? {} : { opacity: "0" }}>
      {muted &&
        <div className="AboveTimeline">
          <button aria-label="Unmute Button" className="UnmuteButton" onClick={unmute} style={{ opacity: "1" }}>Unmute Audio</button>
        </div>
      }
      <div className="AboveTimeline">
        <div className="ControlContainer">
          {previousEpisode &&
            <IconButton buttonName="Previous" imageAlt="Previous Icon" imageSource={previousIcon} onClick={() => {
              dispatch(setEpisode({
                playlist: playlist.key,
                language: selectedEpisode.language,
                season: selectedEpisode.season,
                key: previousEpisode.key,
                name: previousEpisode.name
              }));
              sync();
            }} ></IconButton>
          }
          {playing
            ? <IconButton buttonName="Pause" imageAlt="Pause Icon" imageSource={pauseIcon} onClick={() => {
              dispatch(pause());
              sync();
            }} ></IconButton>
            : <IconButton buttonName="Play" imageAlt="Play Icon" imageSource={playIcon} onClick={() => {
              dispatch(play());
              sync();
            }} ></IconButton>
          }
          {nextEpisode &&
            <IconButton buttonName="Next" imageAlt="Next Icon" imageSource={nextIcon} onClick={() => {
              dispatch(setEpisode({
                playlist: playlist.key,
                language: selectedEpisode.language,
                season: selectedEpisode.season,
                key: nextEpisode.key,
                name: nextEpisode.name
              }));
              sync();
            }} ></IconButton>
          }
          <p className="Time">{Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}{Math.floor(time % 60)} / {Math.floor(duration / 60)}:{duration % 60 < 10 ? "0" : ""}{Math.floor(duration % 60)}</p>
        </div>
        <div className="ControlContainer">
          {!native &&
            <VolumeChanger />
          }
          {document.fullscreenElement === document.getElementById("video-wrapper")
            ? <IconButton buttonName="Exit Fullscreen" imageAlt="Exit Fullscreen Icon" imageSource={exitFullscreenIcon} onClick={() => document.exitFullscreen()} ></IconButton>
            : <IconButton buttonName="Fullscreen" imageAlt="Fullscreen Icon" imageSource={fullscreenIcon} onClick={() => document.getElementById("video-wrapper").requestFullscreen()} ></IconButton>
          }
        </div>
      </div>
      <Timeline />
    </div>
  );
}

VideoControls.defaultProps = {
  visible: false,
  muted: false
}

VideoControls.propTypes = {
  visible: PropTypes.bool,
  muted: PropTypes.bool,
  unmute: PropTypes.func.isRequired
}

const VolumeChanger = () => {
  const volume = useSelector(state => state.player.volume);
  const dispatch = useDispatch();
  const slider = useRef();

  const bind = useDrag(state => {
    if (slider.current) {
      const rect = slider.current.getBoundingClientRect();
      const relativeVolume = clamp((state.xy[0] - rect.x) / rect.width, 0, 1);
      dispatch(setVolume(relativeVolume));
    }
  }, {});

  return (
    <>
      <div className="VolumeChanger">
        <img src={volumeIcon} alt="Volume" />
        <div {...bind()} ref={slider} className="VolumeSlider">
          <div className="Volume" style={{ backgroundSize: `${volume * 100}% 100%` }}></div>
          <div className="Thumb" style={{ left: `${volume * 100}%` }}></div>
        </div>
      </div>
    </>
  );
}


const Timeline = () => {
  const duration = useSelector(state => state.player.duration);
  const played = useSelector(state => state.player.played);
  const loaded = useSelector(state => state.player.loaded);
  const dispatch = useDispatch();
  const timeline = useRef();

  const bind = useDrag(state => {
    if (timeline.current && state.type !== "pointerup") {
      const rect = timeline.current.getBoundingClientRect();
      const relativeTime = clamp((state.xy[0] - rect.x) / rect.width, 0, 1);
      dispatch(setPlayed(relativeTime));
      dispatch(setTime(relativeTime * duration));
    } else {
      sync();
    }
  }, {});

  return (
    <>
      <div {...bind()} ref={timeline} className="Timeline">
        <div className="Buffered" style={{ backgroundSize: `${loaded * 100}% 100%` }}></div>
        <div className="Played" style={{ backgroundSize: `${played * 100}% 100%` }}></div>
        <div className="Thumb" style={{ left: `${played * 100}%` }}></div>
      </div>
    </>
  );
}


export default VideoArea;
