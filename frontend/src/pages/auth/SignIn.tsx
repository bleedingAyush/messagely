import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "./components/FormInput";
import "./styles/authPagesStyle.scss";
import { inputConfig } from "./utils/inputConfig";
import { useSignInMutation } from "../../services/messagelyApi";
import { useSetToken } from "../../hooks/useSetToken";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IAuthUser, IInputConfig } from "../../types";
import Toast from "../../libs/Toast";

const userData = {
  username: "",
  password: "",
};

const SignIn = () => {
  const [inputValues, setInputValues] = useState<IAuthUser>(userData);
  const [signInUser, { data, error, isLoading, isSuccess, isError }] =
    useSignInMutation();

  const navigate = useNavigate();
  const userDetails = { data, isSuccess };
  const isTokenSet = useSetToken(userDetails);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isTokenSet) navigate("/chats");
  }, [isTokenSet]);

  useEffect(() => {
    if (isError && error) {
      if ("data" in error) {
        let message = error?.data?.message;
        toast.error(message);
      } else if ("status" in error) {
        toast.error("Something went wrong");
      }
    }
  }, [isError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValues.username.length == 0 && inputValues.password.length == 0)
      return;

    const userDetails = {
      username: inputValues?.username.trim(),
      password: inputValues?.password.trim(),
    };
    signInUser(userDetails);
  };

  return (
    <div className="auth-container" style={{ height: window.innerHeight }}>
      <span className="title">Messagely</span>
      <form action="" className="form" onSubmit={handleSubmit}>
        {inputConfig.map((item: IInputConfig) => {
          const itemName: string = item?.name;
          const formValue = inputValues[itemName as keyof IAuthUser];
          return (
            <FormInput
              key={item.id}
              {...item}
              value={formValue}
              onChange={handleChange}
            />
          );
        })}
        <button className="submit-btn" disabled={isLoading}>
          {isLoading ? <span>Signing in...</span> : <span>Sign In</span>}
        </button>
      </form>
      <Link to={"/signup"} className="link">
        <button>Create new account</button>
      </Link>
      <Toast limit={3} />
    </div>
  );
};

export default SignIn;
