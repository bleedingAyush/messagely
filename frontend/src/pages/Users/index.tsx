import React, { useEffect, useState } from "react";
import InfiniteLoader from "react-window-infinite-loader";
import { useCreateChatMutation } from "../../services/messagelyApi";
import { FixedSizeList as List } from "react-window";
import "./styles/index.scss";
import useDimensions from "../../hooks/useDimensions";
import SkeletonLoad from "../../components/SkeletonLoad";
import useUsersData from "./hooks/useUsersData";
import { getFormattedUrl } from "../../utils/getFormattedUrl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorComponent from "../../components/Error";

const UsersListView = () => {
  const { dimensions } = useDimensions();
  const { usersData, isLoading, isError, refetch } = useUsersData();
  const navigate = useNavigate();
  const [
    createChat,
    {
      data,
      isLoading: isChatLoading,
      isSuccess: isChatSuccess,
      isError: isChatError,
    },
  ] = useCreateChatMutation();

  const loadMoreItems = () => {};

  const createChatFunc = (event: React.MouseEvent<HTMLButtonElement>) => {
    const userId = event.currentTarget.id;
    const chatDetails = {
      userId,
    };
    createChat(chatDetails);
  };

  useEffect(() => {
    if (isChatSuccess) {
      navigate(`/chats/${data?._id}`);
    }
  }, [isChatSuccess]);

  const refetchUsers = () => {
    refetch();
  };

  useEffect(() => {
    if (isChatError) toast.error("Something went wrong", { toastId: "users" });
  }, [isChatError]);

  if (isError) {
    return <ErrorComponent refetch={refetchUsers} />;
  }

  return (
    <>
      <div className="user-list-container">
        {isChatLoading && <LoadingSpinner />}
        {isLoading ? (
          <SkeletonLoad />
        ) : (
          <InfiniteLoader
            isItemLoaded={(index) => index < usersData.length}
            itemCount={usersData.length}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                itemCount={usersData.length}
                width={dimensions?.width}
                height={dimensions?.height}
                itemSize={82}
                onItemsRendered={onItemsRendered}
                ref={ref}
              >
                {({ index, style }) => {
                  const item = usersData[index];
                  let url = getFormattedUrl(item?.profilePic);
                  return (
                    <button
                      style={style}
                      className="user-container hover"
                      id={`${item._id}`}
                      onClick={createChatFunc}
                    >
                      <div className="user">
                        <img src={`${url}`} alt="" />
                        <div className="user-details">
                          <span className="user-name">{item.username}</span>
                        </div>
                        <div className="chat-box">Chat</div>
                      </div>
                    </button>
                  );
                }}
              </List>
            )}
          </InfiniteLoader>
        )}
      </div>
    </>
  );
};

export default UsersListView;
