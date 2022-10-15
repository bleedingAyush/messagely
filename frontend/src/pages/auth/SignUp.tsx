import React from "react";
import { Link } from "react-router-dom";
import FormInput from "./components/FormInput";
import "./styles/authPagesStyle.scss";
import { inputConfig } from "./utils/inputConfig";
import { IAuthUser, IInputConfig } from "../../types";
import useSignUp from "./hooks/useSignUp";
import Toast from "../../libs/Toast";

const SignUp = () => {
  const {
    loading,
    uploadImage,
    handleChange,
    handleSubmit,
    isLoading,
    inputValues,
  } = useSignUp();

  const signUpInputValues = [
    ...inputConfig,
    {
      id: 3,
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Passwords don't match",
      label: "Confirm Password",
      inputPattern: inputValues?.password,
      required: true,
    },
  ];

  return (
    <div className="auth-container" style={{ minHeight: window.innerHeight }}>
      <span className="title">Messagely</span>
      <form action="" className="form" onSubmit={handleSubmit}>
        {signUpInputValues.map((item: IInputConfig) => {
          const itemName = item?.name;
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
        <input type="file" onChange={uploadImage} className="file-input" />
        <button className="submit-btn" disabled={isLoading}>
          {loading ? <span>Signing up...</span> : <span>Sign Up</span>}
        </button>
      </form>
      <Link to={"/signin"} className="link">
        <button>Sign in securely</button>
      </Link>
      <Toast />
    </div>
  );
};

export default SignUp;
