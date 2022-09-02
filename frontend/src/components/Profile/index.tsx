import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, useNavigate, useParams } from "react-router-dom";
import "./styles/index.scss";
import { User } from "../../hooks/useUserDetails";
import Skeleton from "react-loading-skeleton";
import useClickOutside from "../../hooks/useClickOutside";
import { ReactComponent as Logout } from "../../assets/log-out.svg";
import { ReactComponent as Check } from "../../assets/check.svg";
import {
  useChangeUsernameMutation,
  useGetImagekitAuthParamsQuery,
  useLazyGetImagekitAuthParamsQuery,
  useProfilePicMutation,
  useUploadPicMutation,
} from "../../services/messagelyApi";
import { getFormattedUrl } from "../../utils/getFormattedUrl";
import { ReactComponent as Camera } from "../../assets/camera.svg";

import { ReactComponent as BackArrow } from "../../assets/back-arrow.svg";
import Toast from "../../libs/Toast";
import useUploadImage from "./hooks/useUploadImage";
import useChangeUsername from "./hooks/useChangeUsername";

const LoadingSpinner = () => {
  const [isLoadingSpinner, setLoadingSpinner] = useState(false);
  const [
    getImageKitAuthParams,
    {
      data: imageKitAuthData,
      isLoading: isImageKitAuthLoading,
      isSuccess: isImagekitAuthSuccess,
      isError: isImageKitAuthError,
    },
  ] = useLazyGetImagekitAuthParamsQuery();
  const [
    updateProfilePic,
    { isError: isProfileError, isSuccess: isProfileSuccess },
  ] = useProfilePicMutation({
    fixedCacheKey: "update-profile-key",
  });
  const [
    uploadPic,
    {
      data: imageUploadData,
      isLoading: isImageUploadLoading,
      isSuccess: isImageUploadSuccess,
      isError: isImageUploadError,
      error: imageUploadError,
    },
  ] = useUploadPicMutation({
    fixedCacheKey: "upload-pic-key",
  });

  useEffect(() => {
    if (isProfileSuccess) {
      stopLoading();
    }
  }, [isProfileSuccess]);

  const startLoading = () => {
    if (!isLoadingSpinner) setLoadingSpinner(true);
  };
  const stopLoading = () => {
    if (isLoadingSpinner) setLoadingSpinner(false);
  };

  useEffect(() => {
    if (isImageKitAuthLoading || isImageUploadLoading) {
      startLoading();
    }
    if (isImageUploadError || isProfileError || isImageKitAuthError) {
      stopLoading();
    }
  }, [
    isImageKitAuthLoading,
    isImageUploadError,
    isProfileError,
    isImageKitAuthError,
    isImageUploadLoading,
  ]);

  return (
    <>
      {isLoadingSpinner && (
        <div className="loading-container-profilePic">
          <div className="loading-ring">
            <div></div>
          </div>
        </div>
      )}
    </>
  );
};

const Profile = () => {
  const { profilePic, username } = User();

  const { id } = useParams();
  const navigate = useNavigate();
  const { uploadImage } = useUploadImage();
  const { submitUsername, handleChange, value, isLoading } =
    useChangeUsername();

  const goToSettings = () => {
    const doc = document.querySelector(".sidebar");
    doc?.classList.toggle("show");
  };

  const hideSettings = () => {
    const doc = document.querySelector(".sidebar");
    doc?.classList.remove("show");
  };

  const sidebarRef = useClickOutside(hideSettings);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  const url = getFormattedUrl(profilePic);
  return (
    <>
      <nav className={id ? "profile hide" : "profile"} id="profile">
        <button className="profile-btn" onClick={goToSettings}>
          {profilePic ? (
            <img src={url} alt="Profile pic" />
          ) : (
            <Skeleton
              circle
              width={"48px"}
              height={"48px"}
              baseColor="rgba(105, 109, 140, 0.41)"
              enableAnimation={false}
            />
          )}
        </button>
        <div className="sidebar" ref={sidebarRef}>
          <button className="back-btn" onClick={hideSettings} id="backBtn">
            <BackArrow />
          </button>
          <div className="image-container">
            <LoadingSpinner />
            {url ? (
              <>
                <img src={url} alt="" />
              </>
            ) : (
              <Skeleton
                circle
                width={"140px"}
                height={"140px"}
                baseColor="rgba(105, 109, 140, 0.41)"
                enableAnimation={false}
              />
            )}
            <label htmlFor="file-upload">
              <input
                className="file-upload-input"
                type={"file"}
                onChange={uploadImage}
              />
              <Camera className="camera" />
            </label>
          </div>
          <div className="username-input">
            <span>Username</span>
            <div className="input-container">
              <input
                minLength={3}
                type="text"
                defaultValue={username}
                onChange={handleChange}
                maxLength={15}
              />
              {value && <Check className="check" onClick={submitUsername} />}
              {isLoading && (
                <div className="loading-ring">
                  <div></div>
                </div>
              )}
            </div>
          </div>
          <button className="logout" onClick={handleLogout}>
            <span>Logout</span>
            <Logout width={"20px"} height={"20px"} color={"#BA0F30"} />
          </button>
        </div>
      </nav>
    </>
  );
};

export default Profile;
