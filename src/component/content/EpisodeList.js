import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sync } from "../../logic/connection";
import { languageAlt, languageImage, seasonName } from "../../logic/node";
import { isElementInViewport } from "../../logic/utils";
import playIcon from "../../media/play.svg";
import { setDefaults, setEpisode, setLanguage, setSeason, setSeasons } from "../../redux/contentSlice";
import { play, setTime } from "../../redux/playerSlice";
import "./EpisodeList.scss";

const EpisodeList = () => {
  const native = useSelector(state => state.interface.native);
  const playlist = useSelector(state => state.content.playlist);
  const seasons = useSelector(state => state.content.seasons);
  const availabilities = useSelector(state => state.content.availabilities);
  const language = useSelector(state => state.content.language);
  const season = useSelector(state => state.content.season);
  const selectedEpisode = useSelector(state => state.content.episode);
  const episodeList = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (episodeList.current && playlist) {
      const seasonList = playlist.seasons;
      const availableLanguage = [...new Set(playlist.seasons.map(season => season.language))].sort();
      const availableSeasons = [...new Set(seasonList.map(season => season.index))].sort((first, second) => {
        if (1 / first > 1 / second && first >= 1 / first) {
          return 1;
        } else if (1 / first < 1 / second && second >= 1 / second) {
          return -1;
        } else {
          return 0;
        }
      }).reverse();
      const seasons = [[]];
      playlist.seasons.forEach(season => {
        if (!seasons[season.language]) {
          seasons[season.language] = [];
        }
        seasons[season.language][season.index] = season;
      });
      dispatch(setSeasons(seasons));

      const defaultLanguage = playlist.seasons.filter(season => season.index === availableSeasons[0]).map(season => season.language).sort()[0];
      const defaultSeason = availableSeasons[0];
      dispatch(setDefaults({
        availabilities: {
          languages: availableLanguage,
          seasons: availableSeasons
        },
        language: defaultLanguage,
        season: defaultSeason
      }));
      if (!isElementInViewport(episodeList.current)) {
        episodeList.current.scrollIntoView({
          behavior: "smooth"
        });
      }
    }
  }, [episodeList, playlist, dispatch]);

  return (
    <>
      {playlist &&
        <div ref={episodeList} className={native ? "NativeEpisodeList" : "EpisodeList"}>
          {seasons && availabilities && language !== undefined && season !== undefined &&
            <>
              <ListHeader playlist={playlist} seasons={seasons} availabilities={availabilities} language={language} season={season} />
              <ul className="Episodes">
                {seasons[language][season] && seasons[language][season].episodes
                  .map(episode => (
                    <Episode key={episode.key} episode={episode} selected={selectedEpisode && episode.key === selectedEpisode.key} />
                  ))}
              </ul>
            </>
          }
        </div>
      }
    </>
  );
}

export const ListHeader = ({ playlist, seasons, availabilities, language, season }) => {
  return (
    <div className="ListHeader">
      <span>{playlist.name}</span>
      <LanguageSelector availabilities={availabilities} language={language} />
      <SeasonSelector seasons={seasons} availabilities={availabilities} language={language} season={season} />
    </div>
  );
}

ListHeader.propTypes = {
  playlist: PropTypes.object.isRequired,
  seasons: PropTypes.array.isRequired,
  availabilities: PropTypes.object.isRequired,
  language: PropTypes.any.isRequired,
  season: PropTypes.number.isRequired
}

export const LanguageSelector = ({ availabilities, language }) => {
  const dispatch = useDispatch();

  const imageSources = languageImage(language);
  const imageAlt = languageAlt(language);

  return (
    <div className={`LanguageSelector selector ${availabilities.languages.length < 2 ? "empty" : ""}`}>
      <div className="selector-current">
        {imageSources.length === 1 ?
          <img src={imageSources[0]} alt={imageAlt[0]} /> :
          <div className="selector-dual-image">
            <img className="left" src={imageSources[0]} alt={imageAlt[0]} />
            <img className="right" src={imageSources[1]} alt={imageAlt[1]} />
          </div>
        }
      </div>
      <div className="selector-items">
        {availabilities.languages.filter(filterLanguage => filterLanguage !== language).map(language => {
          const imageSources = languageImage(language);
          const imageAlt = languageAlt(language);

          return (
            imageSources.length === 1 ?
              <button key={language} className="selector-item" aria-label={`Select ${languageAlt(language)}`} onClick={() => dispatch(setLanguage(language))}>
                <img key={language} src={imageSources[0]} alt={imageAlt[0]} />
              </button> :
              <button key={language} className="selector-item" aria-label={`Select ${languageAlt(language)}`} onClick={() => dispatch(setLanguage(language))}>
                <div className="selector-dual-image">
                  <img className="left" src={imageSources[0]} alt={imageAlt[0]} />
                  <img className="right" src={imageSources[1]} alt={imageAlt[1]} />
                </div>
              </button>
          );
        })}
      </div>
    </div>
  );
}

LanguageSelector.propTypes = {
  availabilities: PropTypes.object.isRequired,
  language: PropTypes.any.isRequired
}

export const SeasonSelector = ({ seasons, availabilities, language, season }) => {
  const dispatch = useDispatch();

  const currentSeasonName = seasonName(season);

  return (
    <>
      {currentSeasonName &&
        <div className={`SeasonSelector selector ${availabilities.seasons.length < 2 ? "empty" : ""}`}>
          <div className={`selector-current ${!seasons[language][season] ? "unavailable" : ""}`}>
            <span>{currentSeasonName}</span>
          </div>
          <div className="selector-items">
            {availabilities.seasons.filter(filterSeason => filterSeason !== season).map(season =>
              <button key={season} className={`selector-item ${!seasons[language][season] ? "unavailable" : ""}`} aria-label={`Select Season ${season}`} onClick={() => dispatch(setSeason(season))}>
                <span>{seasonName(season)}</span>
              </button>
            )}
          </div>
        </div>
      }
    </>
  );
}

SeasonSelector.propTypes = {
  seasons: PropTypes.array.isRequired,
  availabilities: PropTypes.object.isRequired,
  language: PropTypes.any.isRequired,
  season: PropTypes.number.isRequired
}


const Episode = ({ episode, selected }) => {
  const playlist = useSelector(state => state.content.playlist);
  const language = useSelector(state => state.content.language);
  const season = useSelector(state => state.content.season);
  const dispatch = useDispatch();

  const onSelect = () => {
    dispatch(setEpisode({
      playlist: playlist.key,
      language: language,
      season: season,
      key: episode.key,
      name: episode.name
    }));
    dispatch(setTime(0));
    dispatch(play());
    sync();
  }

  return (
    <li className={`Episode ${!episode.available ? "unavailable" : ""} ${selected ? "selected" : ""}`}>
      <button aria-label={`Play Episode ${episode.index}`} onClick={onSelect}>
        <img src={playIcon} alt="Play Icon" />
        {episode.name}
      </button>
      <span>{episode.index}</span>
    </li>
  );
}

Episode.defaultProps = {
  selected: false
}

Episode.propTypes = {
  episode: PropTypes.object.isRequired,
  selected: PropTypes.bool
}


export default EpisodeList;
