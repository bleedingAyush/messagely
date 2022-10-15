import React, { useState, useEffect, useCallback } from "react";
import { ReactComponent as SideMenuIcon } from "../assets/side-menu.svg";
import "./styles/SideMenu.scss";
import useClickOutside from "../hooks/useClickOutside";
import Modal from "./Modal";

const SideMenuComponent = ({ chat }: any) => {
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
      <div className="side-menu-container" ref={dropdownRef}>
        <button className="side-menu-btn" onClick={toggleModal} id="menuButton">
          <SideMenuIcon />
        </button>
        <div className="change-group-container">
          <Modal
            id="side-menu"
            chat={chat}
            isModalVisibile={isModalVisbile}
            closeModal={closeModal}
          />
        </div>
      </div>
    </>
  );
};

export default SideMenuComponent;
