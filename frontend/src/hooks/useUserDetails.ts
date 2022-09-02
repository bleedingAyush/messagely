import { IUser } from "../types";
import { useAuthUserQuery } from "../services/messagelyApi";

export const User = () => {
  const token = localStorage.getItem("auth_token");
  const { data, isLoading, isSuccess, isError } = useAuthUserQuery(token);

  const values = { ...data, isLoading, isSuccess, isError };
  return values;
};
