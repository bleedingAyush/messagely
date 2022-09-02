import { IAuthData } from "../types";

interface IuserDetails {
  data?: IAuthData;
  isSuccess: boolean;
}
export const useSetToken = (userDetails: IuserDetails) => {
  if (userDetails?.isSuccess && userDetails?.data?.token) {
    const { token } = userDetails?.data;
    localStorage.setItem("auth_token", token);
    return true;
  }
  return false;
};
