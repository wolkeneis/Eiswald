import { Share } from "@capacitor/share";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { leaveRoom, sync } from "../../logic/connection";
import addIcon from "../../media/add.svg";
import inviteIcon from "../../media/invite.svg";
import leaveIcon from "../../media/leave.svg";
//import pipIcon from "../../media/pip.svg";
import { setEpisode } from "../../redux/contentSlice";
import { play, setSource, setTime } from "../../redux/playerSlice";
import IconButton from "../IconButton";
import "./RoomControls.scss";

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

export default RoomControls;
