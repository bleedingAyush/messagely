import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "../styles/ChatsListView.scss";
import "react-loading-skeleton/dist/skeleton.css";
import useDimensions from "../../../hooks/useDimensions";
import SkeletonLoad from "../../../components/SkeletonLoad";
import useChatsData from "../hooks/useChatsData";
import { getFormattedUrl } from "../../../utils/getFormattedUrl";
import ErrorComponent from "../../../components/Error";

const ChatsListView = () => {
  const { id } = useParams();
  const { dimensions, chatInboxWidth } = useDimensions();
  const navigate = useNavigate();
  const { chatsData, isLoading, isError, getAllChats } = useChatsData();

  const loadMoreItems = () => {};

  const openChatInbox = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    navigate(`/chats/${id}`);
  };

  const refetchChats = () => {
    getAllChats();
  };
  if (chatsData.length == 0 && isError) {
    return <ErrorComponent refetch={refetchChats} />;
  }

  return (
    <>
      <div className="chat-container">
        {isLoading ? (
          <SkeletonLoad />
        ) : (
          <>
            <div className={id ? "list-view hide" : "list-view"} id="listView">
              <InfiniteLoader
                isItemLoaded={(index) => index < chatsData.length}
                itemCount={chatsData.length}
                loadMoreItems={loadMoreItems}
              >
                {({ onItemsRendered, ref }) => (
                  <List
                    itemCount={chatsData.length}
                    width={dimensions?.width}
                    height={dimensions?.height}
                    itemSize={82}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                  >
                    {({ index, style }) => {
                      const item = chatsData[index];
                      const groupDetails = {
                        username: item?.chatName,
                        profilePic: item?.groupAdmin?.profilePic,
                      };
                      const user =
                        item?.chatName == "sender"
                          ? item?.users[0]
                          : groupDetails;
                      let url = getFormattedUrl(user?.profilePic);
                      return (
                        <button
                          style={style}
                          className="user-container hover"
                          onClick={openChatInbox}
                          id={item._id}
                        >
                          <div className="user">
                            <img src={`${url}`} alt="" />
                            <div className="user-details">
                              <span className="user-name">{user.username}</span>
                            </div>
                          </div>
                        </button>
                      );
                    }}
                  </List>
                )}
              </InfiniteLoader>
            </div>
          </>
        )}
        {id && (
          <div
            className="outlet-container"
            style={{ width: chatInboxWidth }}
            id="outlet"
          >
            <Outlet />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatsListView;
