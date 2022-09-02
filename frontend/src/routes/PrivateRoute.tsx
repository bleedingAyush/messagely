import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Profile from "../components/Profile";

const useAuth = () => {
  const isAuthToken = localStorage.getItem("auth_token") != null;
  return isAuthToken;
};

function PrivateRoute() {
  const location = useLocation();
  const isAuth: boolean = useAuth();

  return isAuth ? (
    <>
      <Profile />
      <Outlet />
    </>
  ) : (
    <Navigate to={"/signin"} replace state={{ from: location }} />
  );
}

export default PrivateRoute;
