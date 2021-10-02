import { useDrag } from "@use-gesture/react";
import PropTypes from "prop-types";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sync } from "../../logic/connection";
import { clamp } from "../../logic/utils";
import exitFullscreenIcon from "../../media/exit-fullscreen.svg";
import fullscreenIcon from "../../media/fullscreen.svg";
import nextIcon from "../../media/next.svg";
import pauseIcon from "../../media/pause.svg";
import playIcon from "../../media/play-filled.svg";
import previousIcon from "../../media/previous.svg";
import volumeIcon from "../../media/volume.svg";
//import pipIcon from "../../media/pip.svg";
import { setEpisode } from "../../redux/contentSlice";
import { pause, play, setPlayed, setTime, setVolume } from "../../redux/playerSlice";
import IconButton from "../IconButton";
import "./VideoControls.scss";

const VideoControls = ({ visible, muted, unmute }) => {
  const playlists = useSelector(state => state.content.playlists);
  const selectedEpisode = useSelector(state => state.content.episode);

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
        </div>}
      <div className="AboveTimeline">
        <LeftControlContainer previousEpisode={previousEpisode} nextEpisode={nextEpisode} />
        <RightControlContainer />
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

const LeftControlContainer = ({ previousEpisode, nextEpisode }) => {
  const roomId = useSelector(state => state.room.roomId);
  const mode = useSelector(state => state.room.mode);
  const host = useSelector(state => state.room.host);
  const duration = useSelector(state => state.player.duration);
  const time = useSelector(state => state.player.time);
  const playing = useSelector(state => state.player.playing);
  const selectedEpisode = useSelector(state => state.content.episode);
  const dispatch = useDispatch();

  const parseTime = (time) => {
    return `${Math.floor(time / 60)}:${time % 60 < 10 ? "0" : ""}${Math.floor(time % 60)}`
  }

  return (
    <div className="ControlContainer">
      {(!roomId || (host || mode !== "strict")) && previousEpisode &&
        <IconButton buttonName="Previous" imageAlt="Previous Icon" imageSource={previousIcon} onClick={() => {
          dispatch(setEpisode({
            playlist: selectedEpisode.playlist,
            language: selectedEpisode.language,
            season: selectedEpisode.season,
            key: previousEpisode.key,
            name: previousEpisode.name
          }));
          dispatch(setTime(0));
          dispatch(play());
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
      {(!roomId || (host || mode !== "strict")) && nextEpisode &&
        <IconButton buttonName="Next" imageAlt="Next Icon" imageSource={nextIcon} onClick={() => {
          dispatch(setEpisode({
            playlist: selectedEpisode.playlist,
            language: selectedEpisode.language,
            season: selectedEpisode.season,
            key: nextEpisode.key,
            name: nextEpisode.name
          }));
          dispatch(setTime(0));
          dispatch(play());
          sync();
        }} ></IconButton>
      }
      <p className="Time">{parseTime(time)} / {parseTime(duration)}</p>
    </div>
  )
}

const RightControlContainer = () => {
  return (
    <div className="ControlContainer">
      <VolumeChanger />
      {document.fullscreenElement === document.getElementById("video-wrapper")
        ? <IconButton buttonName="Exit Fullscreen" imageAlt="Exit Fullscreen Icon" imageSource={exitFullscreenIcon} onClick={() => document.exitFullscreen()} ></IconButton>
        : <IconButton buttonName="Fullscreen" imageAlt="Fullscreen Icon" imageSource={fullscreenIcon} onClick={() => document.getElementById("video-wrapper").requestFullscreen()} ></IconButton>
      }
    </div>
  )
}


const VolumeChanger = () => {
  const native = useSelector(state => state.interface.native);
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
      {!native &&
        <div className="VolumeChanger">
          <img src={volumeIcon} alt="Volume" />
          <div {...bind()} ref={slider} className="VolumeSlider">
            <div className="Volume" style={{ backgroundSize: `${volume * 100}% 100%` }}></div>
            <div className="Thumb" style={{ left: `${volume * 100}%` }}></div>
          </div>
        </div>
      }
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

export default VideoControls;
