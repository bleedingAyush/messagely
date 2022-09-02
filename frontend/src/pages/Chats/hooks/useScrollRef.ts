import { useEffect, useRef } from "react";
import { User } from "../../../hooks/useUserDetails";
import { messagelyApi } from "../../../services/messagelyApi";
import { IMessage } from "../../../types";

const useScrollRef = (islastItemChatId: boolean, id: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const queryArg = {
    chatId: id,
    date: "none",
  };
  const user = User();
  const {
    messagesQueryData,
    isQueryLoading,
    isQuerySuccess,
    isQueryUninitialized,
    isQueryFetching,
    isQueryError,
  }: any = messagelyApi.endpoints.getMessages.useQueryState(queryArg, {
    selectFromResult: (result) => {
      const filteredData = result?.data?.messages
        ?.filter((item) => item?.chat?._id == id)
        .filter((item) => item?.sender?._id == user._id);
      return {
        messagesQueryData: filteredData ?? [],
        isQueryLoading: result.isLoading,
        isQuerySuccess: result.isSuccess,
        isQueryUninitialized: result.isUninitialized,
        isQueryFetching: result.isFetching,
        isQueryError: result.isError,
      };
    },
  });

  useEffect(() => {
    if (isQueryFetching || isQueryError) return;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [
    islastItemChatId,
    messagesQueryData.length,
    isQueryFetching,
    isQueryError,
  ]);

  return scrollRef;
};

export default useScrollRef;
