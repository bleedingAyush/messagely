import { useEffect, useRef } from "react";
import "../styles/ChatHeader.scss";
import { ReactComponent as BackArrow } from "../../../assets/back-arrow.svg";
import { socket } from "../../../socket";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hooks";
import useIsMounted from "../../../hooks/useIsMounted";
import { messagelyApi } from "../../../services/messagelyApi";
import { User } from "../../../hooks/useUserDetails";
import Skeleton from "react-loading-skeleton";
import useChatUser from "../hooks/useChatUser";
import { getFormattedUrl } from "../../../utils/getFormattedUrl";
import SideMenuComponent from "../../../components/SideMenuComponent";
import StickyDate from "./StickyDate";

const ChatHeader = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const chatUser = useChatUser(id);
  const profilePicUrl = getFormattedUrl(chatUser?.profilePic);
  const user = User();

  const goBack = () => {
    navigate("/chats");
  };

  useEffect(() => {
    if (user.isSuccess) {
      socket.emit("setup", user._id);
    }
  }, [user.isSuccess]);

  useEffect(() => {
    socket.on("message recieved", (payload) => {
      if (!payload?.content && payload?.sender?._id == user._id) return;
      const data = { chatId: payload?.chat?._id, date: "none" };
      dispatch(
        messagelyApi.util.updateQueryData("getMessages", data, (draft) => {
          const copiedMessageData = {
            ...payload,
            isOptimisticUpdate: true,
          };
          draft?.messages.push(copiedMessageData);
        })
      );
    });

    socket.on("user_joined", (payload) => {
      if (isMounted()) {
        if (!id) return;
      }
    });
    return () => {
      socket.off("message recieved");
      socket.off("user_joined");
    };
  }, []);

  const baseColor = "rgba(105, 109, 140, 0.41)";
  const highlightColor = "#CDCDCD";
  const enableAnimation = false;

  return (
    <>
      <div className="header">
        <div className="user-details-container">
          <button className="back-btn" onClick={goBack} id="backBtn">
            <BackArrow />
          </button>
          <div className="user-details">
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="" />
            ) : (
              <Skeleton
                circle={true}
                width={"40px"}
                height={"40px"}
                baseColor={baseColor}
                highlightColor={highlightColor}
                enableAnimation={enableAnimation}
              />
            )}
            <div className="user-status-container">
              <span className="username ">
                {chatUser?.username || (
                  <Skeleton
                    width={"70px"}
                    borderRadius={2}
                    baseColor={baseColor}
                    enableAnimation={enableAnimation}
                    highlightColor={highlightColor}
                  />
                )}
              </span>
            </div>
          </div>
        </div>
        <StickyDate />
        {chatUser?.isGroupChat && <SideMenuComponent chat={chatUser} />}
      </div>
    </>
  );
};

export default ChatHeader;
