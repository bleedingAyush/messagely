import React, { useState } from "react";
import { getFormattedUrl } from "../../utils/getFormattedUrl";

const Users = ({
  _id,
  profilePic,
  username,
  addUsers,
  isGroupChatUser,
}: any) => {
  let url = getFormattedUrl(profilePic);
  const [state, setState] = useState(isGroupChatUser);
  const createChatFunc = (event: React.MouseEvent<HTMLButtonElement>) => {
    const userId = event.currentTarget.id;
    if (userId) {
      setState((val: boolean) => !val);
      addUsers(userId);
    }
  };

  return (
    <button
      className="user-container hover"
      id={`${_id}`}
      key={_id}
      onClick={createChatFunc}
    >
      <div className="user">
        <img src={`${url}`} alt="" />
        <div className="user-details">
          <span className="user-name">{username}</span>
        </div>
        <div className="chat-box">{state ? "Added" : "Add"}</div>
      </div>
    </button>
  );
};

export default Users;
