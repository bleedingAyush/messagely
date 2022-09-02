import React from "react";
import { ReactComponent as NoDataSvg } from "../assets/NoData.svg";
import "./styles/Error.scss";

interface IErrorComponent {
  refetch: () => void;
}
const ErrorComponent = ({ refetch }: IErrorComponent) => {
  return (
    <div className="error-message">
      <NoDataSvg className="no-data" />
      <span>Something went wrong</span>
      <button onClick={refetch}>Try Again</button>
    </div>
  );
};

export default ErrorComponent;
