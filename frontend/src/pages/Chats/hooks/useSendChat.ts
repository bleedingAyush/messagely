import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../../hooks/useUserDetails";
import { useAppDispatch } from "../../../redux/hooks";
import { addMessage, assignMessageId } from "../../../redux/messageSlice";
import {
  messagelyApi,
  useSendMessageMutation,
} from "../../../services/messagelyApi";
import { nanoid } from "@reduxjs/toolkit";

const useSendChat = () => {
  const user = User();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [
    sendMessage,
    { data, isLoading, isSuccess, isError, error, originalArgs },
  ] = useSendMessageMutation();
  const [args, setArgs] = useState<any>([]);

  const sendChat = (message: any) => {
    if (!id) return;
    const uid = nanoid();
    const messageData = {
      chatId: id,
      content: message,
    };

    const addMessagePayload = {
      ...messageData,
      _id: uid,
      sender: { _id: user._id },
      chat: { _id: id },
      createdAt: `${new Date().toISOString()}`,
    };
    dispatch(addMessage(addMessagePayload));

    sendMessage(messageData);

    const argsData = {
      chatId: id,
      date: "none",
    };
    // optmistically update the messages cache.
    dispatch(
      messagelyApi.util.updateQueryData("getMessages", argsData, (draft) => {
        const copiedMessageData = {
          ...addMessagePayload,
          isOptimisticUpdate: true,
        };
        draft?.messages.push(copiedMessageData);
      })
    );
  };

  useEffect(() => {
    if (!isError) {
      setArgs((args: any) => [...args, originalArgs]);
    }
  }, [isError]);

  useEffect(() => {
    const handleOnline = async () => {
      for (const arg of args) {
        await sendMessage(arg).unwrap();
      }
      setArgs([]);
    };
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [JSON.stringify(args)]);

  return sendChat as (message: string) => void;
};

export default useSendChat;
