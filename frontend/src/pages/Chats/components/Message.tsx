import dayjs from "dayjs";
import React, { memo } from "react";
import { IMessageData } from "../../../types";
import { getCurrentWeekDays } from "../../../utils/getCurrentWeekDayjs";
import { getFormattedUrl } from "../../../utils/getFormattedUrl";

interface IMessageComponent {
  item: IMessageData;
  index: number;
  isUserChat: boolean;
  className: string;
  prevItem: IMessageData | null;
  nextItem: IMessageData | null;
}

const Message = memo(
  React.forwardRef(
    (
      {
        item,
        index,
        isUserChat,
        className,
        prevItem,
        nextItem,
      }: IMessageComponent,
      ref: React.Ref<HTMLDivElement>
    ) => {
      function giveMargin(prevItem: IMessageData | null, item: IMessageData) {
        if (prevItem) {
          const isSameSenderId = item?.sender?._id === prevItem?.sender?._id;
          if (isSameSenderId) return "small-margin";
        }
        return "large-margin";
      }

      const margin = giveMargin(prevItem, item);
      const date = getCurrentWeekDays(item.createdAt);
      const isSameSenderId = item?.sender?._id === prevItem?.sender?._id;
      let url = getFormattedUrl(item?.sender?.profilePic);

      return (
        <div
          className={`message-container ${className}`}
          id={item._id}
          ref={ref}
        >
          {item?.type !== "date" ? (
            <>
              {isSameSenderId || isUserChat ? (
                <div className="profile-pic"></div>
              ) : (
                <img src={url} alt="" className="profile-pic" />
              )}

              <div
                className={
                  isUserChat
                    ? `text-container user ${margin}`
                    : `text-container sender ${margin}`
                }
              >
                <span className="content">{item.content}</span>
                <div className="time">
                  <span>{dayjs(item?.createdAt).format("hh:mm a")}</span>
                </div>
              </div>
            </>
          ) : (
            <div className={`message-container ${className}`}>
              <div
                className={
                  isUserChat
                    ? `date-container user ${margin}`
                    : `date-container sender ${margin}`
                }
              >
                <span>
                  {date ?? dayjs(item?.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
  ),
  isEqualProps
);

function isEqualProps(prevProps: any, nextProps: any) {
  if (prevProps.index == 0 && nextProps?.prevItem?._id) {
    return false;
  }
  if (prevProps.item._id === nextProps.item._id) {
    return true;
  } else {
    return false;
  }
}

export default Message;
