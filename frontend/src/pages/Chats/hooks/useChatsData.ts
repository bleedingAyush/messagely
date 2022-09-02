import React, { useState, useEffect } from "react";
import { User } from "../../../hooks/useUserDetails";
import { useLazyGetAllChatsQuery } from "../../../services/messagelyApi";

const useChatsData = () => {
  const { _id, isError: isUserError } = User();
  const [
    getAllChats,
    { data, isLoading, isSuccess, isError, isFetching, error, isUninitialized },
  ] = useLazyGetAllChatsQuery({
    selectFromResult: ({
      data,
      isLoading,
      isSuccess,
      isError,
      isFetching,
      error,
      isUninitialized,
    }) => {
      const chats = data
        ? data.map((item) => {
            const filteredItems = item?.users?.filter(
              (user) => user._id !== _id
            );
            const items = { ...item, users: filteredItems };
            return items;
          })
        : [];
      return {
        data: chats,
        isLoading,
        isSuccess,
        isError,
        isFetching,
        error,
        isUninitialized,
      };
    },
  });
  useEffect(() => {
    if (_id) {
      getAllChats();
    }
  }, [_id]);

  return {
    chatsData: data,
    isLoading: isLoading ?? isUninitialized,
    isError: isError || isUserError,
    getAllChats,
  };
};

export default useChatsData;
