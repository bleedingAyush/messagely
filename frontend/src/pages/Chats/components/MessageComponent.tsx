import React, { useEffect } from "react";
import { User } from "../../../hooks/useUserDetails";
import "../styles/MessageComponent.scss";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";
import useGetData from "../../../hooks/useGetData";
import { useParams } from "react-router-dom";
import useGetScrollData from "../hooks/useGetScrollData''";
import useScrollRef from "../hooks/useScrollRef";
import { groupBy } from "lodash";
import MessagesBlock from "./MessagesBlock";

const MessageComponent = () => {
  const { id } = useParams();
  // critical bug: when the device goes offline while loading, the chats and users sends a message
  // it gets save in the store,  when the device comes back online the message from the store is not added to
  // the message list
  const {
    data: messageData,
    isSuccess,
    isError,
    isLoading,
    isFetching,
    hasMoreData,
    firstData,
    isUninitialized,
  } = useGetData(id);

  const { loadMore } = useGetScrollData(messageData, id);

  const getChatId = () => {
    return messageData[0]?.type == "date"
      ? messageData[1]?.chat?._id
      : messageData[0]?.chat?._id;
  };

  const chatId = getChatId();
  const islastItemChatId: boolean = messageData.length > 0 && chatId != id;
  const scrollRef = useScrollRef(islastItemChatId, id);

  const scrollFunc = () => {
    const doc = document.querySelector("#stickyDate");
    if (!doc?.classList.contains("visible")) doc?.classList.add("visible");
  };

  useEffect(() => {
    if (isFetching || islastItemChatId || isUninitialized) {
      const doc = document.querySelector("#stickyDate");
      doc?.classList.remove("visible");
    }
  }, [isFetching, islastItemChatId, isUninitialized]);

  if (isFetching || islastItemChatId || isUninitialized) {
    return (
      <div className="loading-container-msg-component">
        <div className="loading-ring">
          <div></div>
        </div>
      </div>
    );
  }

  const getOrganisedMessage = () => {
    if (messageData.length == 0) return [];
    return groupBy(messageData, (item) => {
      return dayjs(item.createdAt).format("DD/MM/YYYY");
    });
  };

  const byDate = getOrganisedMessage();
  return (
    <>
      {messageData.length > 0 && (
        <div
          id="scrollableDivMessage"
          style={{
            height: "80%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column-reverse",
            padding: "10px 0px",
          }}
          ref={scrollRef}
        >
          <InfiniteScroll
            dataLength={messageData.length}
            hasMore={hasMoreData}
            loader={
              <div className="loading-container-msg-component">
                <div className="loading-ring">
                  <div></div>
                </div>
              </div>
            }
            endMessage={
              <div className="message-container date">
                <div className={`text-container sender large-margin`}>
                  <span>You have seen all the messages</span>
                </div>
              </div>
            }
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              overflow: "inherit",
            }}
            next={loadMore}
            inverse={true}
            onScroll={scrollFunc}
            scrollableTarget="scrollableDivMessage"
          >
            {Object.entries(byDate).map(([date, block]) => {
              return <MessagesBlock key={date} block={block} />;
            })}
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};

export default MessageComponent;
