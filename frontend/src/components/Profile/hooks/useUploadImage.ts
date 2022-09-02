import { useState, useCallback, useEffect, useRef } from "react";
import {
  useLazyGetImagekitAuthParamsQuery,
  useProfilePicMutation,
  useUploadPicMutation,
} from "../../../services/messagelyApi";
import { toast } from "react-toastify";

const imagekitPublicKey = process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY;

const useUploadImage = () => {
  const ref = useRef<null | number>(null);
  const [fileState, setImageFormData] = useState<any>(null);
  const [
    getImageKitAuthParams,
    {
      data: imageKitAuthData,
      isLoading: isImageKitAuthLoading,
      isSuccess: isImagekitAuthSuccess,
      isError: isImageKitAuthError,
    },
  ] = useLazyGetImagekitAuthParamsQuery();

  const [updateProfilePic, { isError: isProfileError }] = useProfilePicMutation(
    {
      fixedCacheKey: "update-profile-key",
    }
  );
  const [
    uploadPic,
    {
      data: imageUploadData,
      isLoading: isImageUploadLoading,
      isSuccess: isImageUploadSuccess,
      isError: isImageUploadError,
    },
  ] = useUploadPicMutation({
    fixedCacheKey: "upload-pic-key",
  });

  useEffect(() => {
    if (isImageUploadSuccess) {
      updateProfilePic({ imageUrl: imageUploadData.url })
        .unwrap()
        .finally(() => {
          toast.success("Profile picture updated", {
            toastId: "profilePicToast",
          });
          setImageFormData(null);
        });
    }
  }, [isImageUploadSuccess]);

  useEffect(() => {
    if (fileState == null || !isImagekitAuthSuccess) return;

    const { token, expire, signature }: any = imageKitAuthData;

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
  }, [fileState, isImagekitAuthSuccess]);

  useEffect(() => {
    if (isImageUploadError || isProfileError || isImageKitAuthError) {
      setImageFormData(null);
      toast.error("Could not upload image", { toastId: "upload-image-error" });
    }
  }, [
    isImageKitAuthLoading,
    isImageUploadError,
    isProfileError,
    isImageKitAuthError,
    isImageUploadLoading,
  ]);

  useEffect(() => {
    if (ref.current === null && fileState !== null) {
      getImageKitAuthParams();
      ref.current = 1;
    }
  }, [fileState]);

  const uploadImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      if (file.type === "image/jpeg" || file.type == "image/png") {
        setImageFormData(file);
        // getImageKitAuthParams();
      } else {
        toast.info("Please select an image", {
          toastId: "profile",
        });
      }
    }
  }, []);
  return { uploadImage };
};

export default useUploadImage;
