import React, { useEffect, useState } from "react";
import "../styles/authPagesStyle.scss";

interface InputProps {
  id: number;
  name: string;
  type: string;
  placeholder?: string;
  errorMessage: string;
  label: string;
  inputPattern?: string;
  required: boolean;
  onChange: (e: any) => void;
  value?: string;
  focused?: boolean;
}

const FormInput = (props: InputProps) => {
  const [focused, setFocused] = useState<boolean>(false);

  const { label, errorMessage, inputPattern, onChange, id, ...inputProps } =
    props;

  const handleFocus = () => {
    setFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (inputProps.name !== "confirmPassword") {
      return;
    }
    const formInput = document.getElementById("formInput");
    if (inputPattern === e.target.value) {
      formInput?.classList.remove("invalidInput");
    } else if (inputPattern !== e.target.value) {
      formInput?.classList.add("invalidInput");
    }
  };

  useEffect(() => {
    if (
      inputProps.value !== inputPattern &&
      inputProps.name === "confirmPassword" &&
      focused
    ) {
      const formInput = document.getElementById("formInput");
      formInput?.classList.add("invalidInput");
    }
  }, [inputProps.value, inputPattern, inputProps.name, focused]);

  return (
    <div className="form-input">
      <input
        focused={focused.toString()}
        id={inputProps.name == "confirmPassword" ? "formInput" : ""}
        {...inputProps}
        onChange={handleChange}
        onBlur={handleFocus}
        onFocus={() =>
          inputProps.name === "confirmPassword" && setFocused(true)
        }
      />
      <span className="error-text">{errorMessage}</span>
    </div>
  );
};

export default FormInput;
