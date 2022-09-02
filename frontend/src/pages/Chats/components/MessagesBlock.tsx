import { useInView } from "react-intersection-observer";
import { User } from "../../../hooks/useUserDetails";
import dayjs from "dayjs";
import Message from "./Message";
import { IMessageData } from "../../../types";
import { useEffect } from "react";
import { addDate } from "../../../redux/dateSlice";
import { useAppDispatch } from "../../../redux/hooks";
import { getCurrentWeekDays } from "../../../utils/getCurrentWeekDayjs";

interface IMessagesBlock {
  block: IMessageData[];
}

const MessagesBlock = ({ block }: IMessagesBlock) => {
  const dispatch = useAppDispatch();
  const [refDateMarker, inViewDateMarker, entryDateMarker] = useInView();
  const [refLastMessage, inViewLastMessage, entryLastMessage] = useInView();
  const user = User();

  useEffect(() => {
    const height = (80 / 100) * window.innerHeight;
    const entryDateMarkerRectY = entryDateMarker?.boundingClientRect?.y;
    const isRect = entryDateMarkerRectY ? entryDateMarkerRectY < height : true;

    if (
      !inViewDateMarker &&
      isRect &&
      (inViewLastMessage ||
        (!inViewLastMessage &&
          // @ts-ignore
          entryLastMessage?.boundingClientRect?.y > height))
    ) {
      const date = block[0].createdAt;
      const weekDays = getCurrentWeekDays(date);
      const formattedDate = dayjs(date).format("DD/MM/YYYY");
      if (date) {
        dispatch(addDate(weekDays ?? formattedDate));
      }
    }
  }, [inViewDateMarker, inViewLastMessage]);

  return (
    <>
      {block.map((item, index: number) => {
        const isUserChat = item?.sender?._id === user._id;
        const className =
          item?.type === "date"
            ? "date"
            : isUserChat
            ? "user-message"
            : "sender-message";

        const prevItem: IMessageData | null =
          index < block?.length ? block[index - 1] : null;

        const nextItem: IMessageData | null =
          index < block?.length ? block[index + 1] : null;

        return (
          <Message
            ref={index === 0 ? refLastMessage : null}
            key={item._id}
            item={item}
            className={className}
            isUserChat={isUserChat}
            index={index}
            prevItem={prevItem}
            nextItem={nextItem}
          />
        );
      })}

      {block[block.length - 1]?.type == "date" && (
        <div ref={refDateMarker} style={{ height: 1 }} />
      )}
    </>
  );
};

export default MessagesBlock;
