import React, { useState } from "react";
import "./styles/index.scss";
import { Outlet, NavLink, useParams } from "react-router-dom";
import Toast from "../../libs/Toast";
import useClickOutside from "../../hooks/useClickOutside";
import Modal from "../../components/Modal";
import Logo from "../../assets/Messagely.png";

const Chats = () => {
  const { id } = useParams();

  const [isModalVisbile, setIsModalVisible] = useState(false);
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const dropdownRef = useClickOutside(closeModal);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisbile);
  };

  return (
    <>
      <div className="home-container">
        <div className="create-group-container" ref={dropdownRef}>
          <button className="group-chat-btn" onClick={toggleModal}>
            Group chat +
          </button>
          <Modal
            id="create-group"
            isModalVisibile={isModalVisbile}
            closeModal={closeModal}
          />
        </div>
        <div className={id ? "home-nav hide" : "home-nav"} id="homeNav">
          <div className="toggle">
            <NavLink
              to={"/chats"}
              className={(navigationData) => {
                return navigationData?.isActive ? "chats active" : "chats";
              }}
            >
              <button className="message-btn" id="messages">
                Chats
              </button>
            </NavLink>
            <NavLink
              to="/users"
              className={(navigationData) => {
                return navigationData?.isActive ? "users active" : "users";
              }}
            >
              <button className="users-btn" id="users">
                Users
              </button>
            </NavLink>
          </div>
        </div>
        <img src={Logo} className="home-img" alt="" />

        <Outlet />
        <Toast />
      </div>
    </>
  );
};

export default Chats;
