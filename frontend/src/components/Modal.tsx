import { useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useClickOutside from "../hooks/useClickOutside";
import Users from "../pages/Home/Users";
import useUsersData from "../pages/Users/hooks/useUsersData";
import {
  useCreateChatMutation,
  useCreateGroupChatMutation,
  useUpdateGroupChatMutation,
} from "../services/messagelyApi";
import "./styles/Modal.scss";
import { CSSTransition } from "react-transition-group";
import LoadingSpinner from "./LoadingSpinner";
interface IModal {
  id: string;
  isModalVisibile: boolean;
  closeModal: () => void;
  chat?: any;
}

const Modal = ({ id, chat, isModalVisibile, closeModal }: IModal) => {
  const { id: chatId } = useParams();
  const [groupSubject, setGroupSubject] = useState("");

  const { usersData, isLoading } = useUsersData();
  const [
    createGroupChat,
    { isLoading: isGroupChatLoading, isSuccess, isError },
  ] = useCreateGroupChatMutation();
  const [
    updateGroupChat,
    {
      isLoading: isUpdateGroupChatLoading,
      isSuccess: isUpdateGroupChatSuccess,
      isError: isUpdateGroupChatError,
    },
  ] = useUpdateGroupChatMutation();
  const usersId = chat?.users?.map((item: any) => item._id);
  const [users, setUsers] = useState<any>(usersId ?? []);

  useEffect(() => {
    if (!isModalVisibile) setGroupSubject("");
  }, [isModalVisibile]);
  const nodeRef = useRef(null);

  const loadMore = () => {};

  const addUsers = (e: any) => {
    setUsers((userValue: any) => {
      if (userValue.includes(e)) {
        let filter = userValue.filter((id: string) => id != e);
        return filter;
      } else {
        return [...userValue, e];
      }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Group Chat Created");
      closeModal();
    }
    if (isUpdateGroupChatSuccess) {
      toast.success("Group Chat Updated");
    }
  }, [isSuccess, isUpdateGroupChatSuccess]);

  useEffect(() => {
    if (isError || isUpdateGroupChatError) toast.error("Something went wrong");
  }, [isError]);

  const onChange = (e: any) => {
    setGroupSubject(e.target.value);
  };

  const createGroup = () => {
    if (users.length < 2) {
      return toast.info("Add more users to the group");
    }
    if (users.length < 0 && groupSubject.length < 0) return;
    if (id == "side-menu") {
      const body = groupSubject.length
        ? {
            chatId,
            name: groupSubject,
            users,
          }
        : { chatId, users };
      updateGroupChat(body);
    } else {
      if (groupSubject.length < 3) {
        return toast.info("Group Subject is too small");
      }
      createGroupChat({
        name: groupSubject,
        users,
      });
    }
  };

  const isLoadingState =
    isLoading || isGroupChatLoading || isUpdateGroupChatLoading;
  const height =
    id != "side-menu" ? window.innerHeight - 20 : window.innerHeight / 2;
  return (
    <CSSTransition
      in={isModalVisibile}
      unmountOnExit
      classNames="modal-transition"
      timeout={300}
      nodeRef={nodeRef}
    >
      <div className="modal" id={id} ref={nodeRef} style={{ height }}>
        <input
          type="text"
          value={groupSubject}
          onChange={onChange}
          placeholder="Group Subject"
        />
        <button
          className="create-group-btn"
          onClick={createGroup}
          disabled={isLoadingState}
        >
          {id == "side-menu" ? "Save Changes" : "Create Group"}
        </button>
        <button className="discard-btn" onClick={closeModal}>
          Discard
        </button>
        {isLoadingState && <LoadingSpinner />}
        <div
          id="scrollableDiv"
          style={{
            height: "100%",
            overflow: "auto",
            // overflow: "hidden",
            marginTop: "0.5rem",
          }}
        >
          <InfiniteScroll
            dataLength={usersData.length}
            hasMore={false}
            loader={
              <div className="loading-container">
                <div className="loading-ring">
                  <div></div>
                </div>
              </div>
            }
            next={loadMore}
            scrollableTarget="scrollableDiv"
          >
            {usersData.map((item, index: number) => {
              const isGroupChatUser = usersId?.includes(item?._id);
              return (
                <Users
                  _id={item?._id}
                  username={item?.username}
                  profilePic={item?.profilePic}
                  addUsers={addUsers}
                  key={item?._id}
                  isGroupChatUser={isGroupChatUser}
                />
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
