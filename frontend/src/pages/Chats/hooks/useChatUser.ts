import { memo, useEffect, useRef, useState } from "react";
import {
  messagelyApi,
  useGetAllChatsQuery,
} from "../../../services/messagelyApi";
import { User } from "../../../hooks/useUserDetails";
import { IChat, IUser } from "../../../types";
import { toast } from "react-toastify";

const useChatUser = (id: any) => {
  const user = User();

  const {
    data: chatData,
    isSuccess: isChatSuccess,
    isError: isChatFailure,
    isLoading: isChatLoading,
  }: any = useGetAllChatsQuery(undefined, {
    selectFromResult: ({ data, isSuccess, isError, isLoading }: any) => {
      const chat = data?.find((chat: IChat) => chat._id === id);
      let cData: any = {};
      if (chat) {
        if (chat?.chatName == "sender") {
          let chatUsers = chat?.users;
          const userData = chatUsers.find(
            (item: IUser) => item._id !== user._id
          );
          cData = userData;
        } else {
          let obj = {
            profilePic: chat?.groupAdmin?.profilePic,
            username: chat?.chatName,
            isGroupChat: true,
            users: chat?.users,
            groupAdmin: chat?.groupAdmin,
          };
          cData = obj;
        }
      }
      return {
        data: cData,
        isSuccess,
        isError,
        isLoading,
      };
    },
  });

  useEffect(() => {
    if (isChatFailure)
      toast.error("Something went wrong", {
        toastId: "usersError",
      });
  }, [isChatFailure]);

  return chatData;
};

export default useChatUser;
