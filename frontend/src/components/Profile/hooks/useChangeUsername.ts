import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User } from "../../../hooks/useUserDetails";
import { useChangeUsernameMutation } from "../../../services/messagelyApi";

const useChangeUsername = () => {
  const { username } = User();

  const [changeUsername, { isLoading, isSuccess, isError }] =
    useChangeUsernameMutation();
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      setValue(null);
    }
  }, [isSuccess]);
  useEffect(() => {
    if (isError)
      toast.error("Could not change username", { toastId: "usernameToast" });
  }, [isError]);

  const handleChange = (e: any) => {
    setValue(e.target.value.trim());
  };

  const submitUsername = () => {
    if (value == username) return;
    changeUsername({ username: value });
  };

  return { submitUsername, handleChange, value, isLoading };
};

export default useChangeUsername;
