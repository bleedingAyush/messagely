import React, { useEffect, useState } from "react";
import {
  messagelyApi,
  useLazyGetMessagesQuery,
} from "../services/messagelyApi";
import dayjs from "dayjs";
import { getDatetime } from "../redux/dateSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { lastItemDate as lastItemDateDispatch } from "../redux/dateSlice";
import { IMessage, IMessageData } from "../types";
import { nanoid } from "@reduxjs/toolkit";

interface IuseGetData {
  data: IMessageData[];
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  firstData?: Partial<IMessageData>[];
  isUninitialized: boolean;
  hasMoreData: boolean;
}

const useGetData = (chatId: any): IuseGetData => {
  const { lastItemDate } = useAppSelector(getDatetime);
  const [messageData, setMessageData] = useState<IMessageData[]>([]);
  const [
    fetchMessages,
    { data, isSuccess, isError, isLoading, isFetching, isUninitialized },
  ] = useLazyGetMessagesQuery();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      lastItemDateDispatch({
        date: "none",
        chatId: null,
      })
    );
    fetchMessages({ chatId, date: "none" });
  }, [chatId]);

  const queryArg = {
    chatId,
    date:
      lastItemDate.chatId !== null && lastItemDate.chatId == chatId
        ? lastItemDate.date
        : null,
  };

  const {
    messagesQueryData,
    hasMoreData,
    isQueryLoading,
    isQuerySuccess,
    isQueryUninitialized,
    isQueryFetching,
    isQueryError,
  } = messagelyApi.endpoints.getMessages.useQueryState(queryArg, {
    selectFromResult: (result: any) => {
      let data = {
        hasMoreData: result.data?.hasMoreData,
        messagesQueryData: result?.data?.messages ?? [],
        isQueryLoading: result.isLoading,
        isQuerySuccess: result.isSuccess,
        isQueryUninitialized: result.isUninitialized,
        isQueryFetching: result.isFetching,
        isQueryError: result.isError,
      };
      if (queryArg.date == null) {
        data = { ...data, messagesQueryData: [], hasMoreData: null };
        return data;
      }
      return data;
    },
  });

  function getOrganisedData(
    queryData: Partial<IMessage>[],
    hasMoreData: boolean
  ) {
    const dataCopy = queryData;
    let anotherArr: IMessageData[] = [];
    dataCopy.map((item, index: number) => {
      let _id = nanoid();
      const itemDate = dayjs(item.createdAt).format("DD/MM/YYYY");

      const prevItemDate = dayjs(dataCopy[index - 1]?.createdAt).format(
        "DD/MM/YYYY"
      );

      // in the first if statement we check if the index is 0 then we push the item to the array
      // then we check if the prevItemDate is equal to the itemDate then we push the item to the array
      if (index === 0) {
        anotherArr.push(item);
      } else if (itemDate != prevItemDate) {
        anotherArr.push(
          { _id, type: "date", createdAt: dataCopy[index - 1]?.createdAt },
          item
        );
      } else {
        anotherArr.push(item);
      }
    });
    if (!hasMoreData && anotherArr.length > 0) {
      anotherArr.push({
        type: "date",
        _id: nanoid(),
        createdAt: anotherArr[anotherArr.length - 1]?.createdAt,
      });
    }
    return anotherArr;
  }

  useEffect(() => {
    // this effect implements the infinte scroll
    if (isQueryError || isQueryFetching) return;
    if (lastItemDate.chatId != chatId || lastItemDate.date == "none") {
      return;
    } else if (isQuerySuccess) {
      let organisedData = getOrganisedData(messagesQueryData, hasMoreData);
      setMessageData([...messageData, ...organisedData]);
    }
  }, [
    isQuerySuccess,
    lastItemDate.date,
    lastItemDate.chatId,
    isQueryError,
    isQueryFetching,
  ]);

  useEffect(() => {
    if (isError || isFetching || lastItemDate.chatId == chatId || !data) return;
    if (isSuccess && lastItemDate.chatId != chatId && !isFetching) {
      let organisedData = getOrganisedData(data?.messages, data?.hasMoreData);

      setMessageData(organisedData);
    }
  }, [lastItemDate.chatId, isSuccess, isFetching, isError]);

  function getMessage(
    filteredQueryData: Partial<IMessage>[],
    messageState: IMessageData[]
  ) {
    let arr: IMessageData[] = [];
    const filteredData = filteredQueryData.slice(-1)[0];
    if (filteredData) {
      let _id = nanoid();

      const lastMessage = messageState[0];
      const lastMessageDate = dayjs(lastMessage?.createdAt).format(
        "DD/MM/YYYY"
      );

      const currentMessage = dayjs(filteredData.createdAt).format("DD/MM/YYYY");

      if (!lastMessage?.createdAt) {
        arr = [
          ...filteredQueryData,
          { _id, type: "date", createdAt: filteredData.createdAt },
        ];
      } else if (lastMessageDate != currentMessage) {
        arr = [
          ...filteredQueryData,
          { _id, type: "date", createdAt: filteredData.createdAt },
        ];
      } else {
        arr = [...filteredQueryData];
      }
    }
    return arr;
  }

  useEffect(() => {
    if (isFetching || isUninitialized || isError) return;

    const filteredQueryData: any = data?.messages.filter((item: any) => {
      if (item?.isOptimisticUpdate) {
        const isDuplicateMessage = messageData
          .map((messageDataItem) => messageDataItem._id)
          .includes(item._id);
        return !isDuplicateMessage;
      }
    });

    if (filteredQueryData.length) {
      setMessageData((stateData) => {
        const formattedData = getMessage(filteredQueryData, stateData);
        return [...formattedData, ...stateData];
      });
    }
  }, [data?.messages?.length, isUninitialized]);

  return {
    data: messageData,
    isSuccess,
    isLoading,
    isError,
    isFetching,
    firstData: data?.messages,
    isUninitialized,
    hasMoreData: hasMoreData ?? data?.hasMoreData,
  };
};

export default useGetData;
