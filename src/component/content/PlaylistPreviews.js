import PropTypes from "prop-types";
import { Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaylist, fetchPlaylists, fetchThumbnail } from "../../logic/node";
import { addPlaylistPreviews, clearPlaylistPreviews, selectPlaylist, setPlaylist } from "../../redux/contentSlice";
import { PlaylistPreviewSkeleton } from "../Loader";
import "./PlaylistPreviews.scss";

const PlaylistPreviews = ({ nodes }) => {
  const [search, setSearch] = useState("");
  const timeout = useRef();
  const playlistPreviews = useSelector(state => state.content.playlistPreviews);
  const dispatch = useDispatch();

  useEffect(() => {
    for (const host in nodes) {
      if (Object.hasOwnProperty.call(nodes, host)) {
        const node = nodes[host];
        if (node.state !== "maintenance") {
          try {
            fetchPlaylists(node)
              .then(response => response.json())
              .then(fetchedPreviews => {
                fetchedPreviews.forEach(fetchedPreview => fetchedPreview.node = node.origin);
                dispatch(addPlaylistPreviews(fetchedPreviews));
              }).catch(() => { });
          } catch { }
        }
      }
    }
    return () => {
      dispatch(clearPlaylistPreviews());
    }
  }, [dispatch, nodes]);

  const onChange = (event) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setSearch(event.target.value);
    }, 500);
  }

  const onSearch = (event) => {
    event.target.scrollIntoView({
      behavior: "smooth"
    });
  }

  return (
    <>
      <SearchBox onChange={onChange} onSearch={onSearch} />
      <div className="PlaylistPreviews">
        {playlistPreviews &&
          playlistPreviews.length !== 0 &&
          playlistPreviews
            .filter(playlistPreview => playlistPreview.name.toLowerCase().includes(search.toLowerCase()))
            .map(playlistPreview => (
              <Suspense key={playlistPreview.key} fallback={<PlaylistPreviewSkeleton />}>
                {nodes[playlistPreview.node] && <PlaylistPreview node={nodes[playlistPreview.node]} playlistPreview={playlistPreview} />}
              </Suspense>
            ))}
      </div>
    </>
  );
}

PlaylistPreviews.defaultProps = {
  nodes: {}
}

PlaylistPreviews.propTypes = {
  nodes: PropTypes.object
}

const SearchBox = ({ onChange, onSearch }) => {
  return (
    <div className="SearchBox">
      <input aria-label="Search Filter" placeholder="Search..." type="search" onChange={onChange} onClick={onSearch} />
    </div>
  );
}

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired
}

const PlaylistPreview = ({ node, playlistPreview }) => {
  const [source, setSource] = useState();
  const playlists = useSelector(state => state.content.playlists);
  const dispatch = useDispatch();

  useEffect(() => {
    setSource(fetchThumbnail(node, playlistPreview.key));
  }, [node, playlistPreview]);

  useEffect(() => {
    return () => {
      if (source) {
        try {
          URL.revokeObjectURL(source.read());
        } finally { }
      }
    };
  }, [source]);

  const onSelect = () => {
    if (playlists[playlistPreview.key]) {
      dispatch(selectPlaylist(playlists[playlistPreview.key]));
    } else {
      fetchPlaylist(node, playlistPreview.key)
        .then(response => response.json())
        .then(fetchedPlaylist => {
          fetchedPlaylist.node = node.origin;
          dispatch(setPlaylist(fetchedPlaylist));
          dispatch(selectPlaylist(fetchedPlaylist));
        });
    }
  }

  return (
    <button aria-label={playlistPreview.name} className="PlaylistPreview" onClick={onSelect} >
      <img alt="Thumbnail" src={source && source.read()} />
      <span>{playlistPreview.name}</span>
    </button>
  );
}

PlaylistPreview.propTypes = {
  node: PropTypes.object.isRequired,
  playlistPreview: PropTypes.object.isRequired
}


export default PlaylistPreviews;
