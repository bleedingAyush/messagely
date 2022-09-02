import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { getDatetime } from "../../../redux/dateSlice";
import useInterval from "../../../hooks/useInterval";

const StickyDate = () => {
  const { date } = useAppSelector(getDatetime);
  const isDocVisible = document
    .querySelector("#stickyDate")
    ?.classList?.contains("visible");

  useInterval(() => {
    if (isDocVisible) {
      document.querySelector("#stickyDate")?.classList?.remove("visible");
    }
  }, 3500);

  if (!date) return null;
  return (
    <div className="sticky-date visible" id="stickyDate">
      <span>{date}</span>
    </div>
  );
};

export default StickyDate;
