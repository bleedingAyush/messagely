import { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../../services/messagelyApi";
import { IUser } from "../../../types";

const useUsersData = () => {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetUsersQuery();
  const [usersData, setUsersData] = useState<IUser[]>([]);
  useEffect(() => {
    if (isSuccess) {
      setUsersData(data);
    }
  }, [isLoading, isSuccess]);

  return { usersData, isLoading, isError, refetch };
};

export default useUsersData;
