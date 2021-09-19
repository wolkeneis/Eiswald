import { Storage } from "@capacitor/storage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNodes } from "../../redux/contentSlice";
import "./Content.scss";
import PlaylistPreviews from "./PlaylistPreviews";
import VideoArea from "./VideoArea";

const Content = () => {
  const nodes = useSelector(state => state.content.nodes);
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
      <VideoArea />
      <PlaylistPreviews nodes={nodes ?? {}} />
    </div>
  );
}

export default Content;
