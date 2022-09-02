import { useCallback, useEffect, useState } from "react";
import { lastItemDate } from "../../../redux/dateSlice";
import { useAppDispatch } from "../../../redux/hooks";
import { useLazyGetMessagesQuery } from "../../../services/messagelyApi";
import { IMessageData } from "../../../types";

const useGetScrollData = (messageData: IMessageData[], id: any) => {
  const dispatch = useAppDispatch();
  const [isMoreDataLoading, setIsMoreDataLoading] = useState(false);

  const [
    fetchMessages,

    {
      data,
      isSuccess: isSuccessScroll,
      isError: isErrorScroll,
      isLoading: isLoadingScroll,
      isFetching: isFetchingScroll,
      error,
      originalArgs,
    },
  ] = useLazyGetMessagesQuery();

  useEffect(() => {
    if (isMoreDataLoading && id !== null) {
      const date = messageData[messageData.length - 1].createdAt;
      if (!date) return;
      fetchMessages({ chatId: id, date });
    }
  }, [isMoreDataLoading]);

  useEffect(() => {
    if (isFetchingScroll || isErrorScroll) return;
    if (isSuccessScroll) {
      const date = messageData[messageData.length - 1].createdAt;
      setIsMoreDataLoading(false);
      dispatch(
        lastItemDate({
          date,
          chatId: id,
        })
      );
    }
  }, [isSuccessScroll, isFetchingScroll, isErrorScroll]);

  useEffect(() => {
    const handleOnline = () => {
      if (isMoreDataLoading && id !== null) {
        const date = messageData[messageData.length - 1].createdAt;
        if (!date) return;
        fetchMessages({ chatId: id, date });
      }
    };
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [isErrorScroll]);

  const loadMore = useCallback(() => {
    setIsMoreDataLoading(true);
  }, []);

  return { loadMore };
};

export default useGetScrollData;
