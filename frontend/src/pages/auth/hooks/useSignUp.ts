import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useSignUpMutation,
  useGetImagekitAuthParamsQuery,
  useProfilePicMutation,
  useUploadPicMutation,
} from "../../../services/messagelyApi";
import { useSetToken } from "../../../hooks/useSetToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IAuthUser } from "../../../types";

const imagekitPublicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY;

const userData = {
  username: "",
  password: "",
  confirmPassword: "",
};

const useSignUp = () => {
  const navigate = useNavigate();
  const [
    uploadPic,
    {
      data: imageUploadData,
      isLoading: isImageUploading,
      isSuccess: isImageUploadSuccess,
      isError: isImageUploadError,
      error: imageUploadError,
    },
  ] = useUploadPicMutation();
  const [inputValues, setInputValues] = useState<IAuthUser>(userData);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileState, setFileState] = useState<File | null>(null);
  const {
    data: imageKitAuthData,
    isSuccess: isImagekitAuthSuccess,
    isError: isImageKitAuthError,
  } = useGetImagekitAuthParamsQuery();

  const [signUp, { data, isError, isLoading, isSuccess, error }] =
    useSignUpMutation();

  const [
    updateProfilePic,
    { isError: isProfileError, isSuccess: isProfileSuccess },
  ] = useProfilePicMutation();
  const userDetails = { data, isLoading, isSuccess, isError };
  const isTokenSet = useSetToken(userDetails);

  useEffect(() => {
    if (isTokenSet && !fileState) {
      navigate("/chats");
    }
  }, [isTokenSet]);

  useEffect(() => {
    if (isImagekitAuthSuccess && isSuccess) {
      const { token, expire, signature } = imageKitAuthData;
      if (!fileState) {
        return stopLoading();
      }
      const formData = new FormData();
      const formDataParams: any = {
        file: fileState,
        useUniqueFileName: true,
        fileName: "name",
        tags: "tag1",
        folder: "/",
        isPrivateFile: false,
        publicKey: imagekitPublicKey,
        signature: signature,
        expire: expire,
        token: token,
      };

      for (var key of Object.keys(formDataParams)) {
        formData.append(key, formDataParams[key]);
      }

      uploadPic(formData);
    }
  }, [isSuccess, isImagekitAuthSuccess]);

  useEffect(() => {
    if (isImageUploadSuccess) {
      updateProfilePic({ imageUrl: imageUploadData.url })
        .unwrap()
        .finally(() => {
          stopLoading();
          navigate("/chats");
        });
    } else if (isImageUploadError) {
      navigate("/chats");
      toast.error("Could not upload image", { toastId: "signup" });
    }
  }, [isImageUploadSuccess, isImageUploadError]);

  const startLoading = () => {
    if (!loading) setLoading(true);
  };

  const stopLoading = () => {
    if (loading) setLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      startLoading();
    }
    if (isImageKitAuthError || isProfileError) {
      stopLoading();
      toast.error("Something went wrong useUploadImage", { toastId: "signup" });
    }
  }, [
    isError,
    isSuccess,
    isLoading,
    isImageKitAuthError,
    isProfileError,
    isProfileSuccess,
  ]);

  useEffect(() => {
    if (isError && error) {
      stopLoading();
      if ("data" in error) {
        let message = error?.data?.message;
        toast.error(message);
      } else if ("status" in error) {
        toast.error("Something went wrong", { toastId: "signup" });
      }
    }
  }, [isError]);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      if (file.type === "image/jpeg" || file.type == "image/png") {
        setFileState(file);
      } else {
        toast.info("Please select an image", { autoClose: 2000 });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValues?.password !== inputValues?.confirmPassword) {
      return;
    }

    const userDetails = {
      username: inputValues?.username.trim(),
      password: inputValues?.password.trim(),
    };
    signUp(userDetails);
  };

  return {
    handleChange,
    handleSubmit,
    loading,
    uploadImage,
    isLoading,
    inputValues,
  };
};

export default useSignUp;
