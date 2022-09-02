import Skeleton from "react-loading-skeleton";
import { useLocation, useParams } from "react-router-dom";
import "./styles/SkeletonLoad.scss";

interface IUserInfoSkeleton {
  baseColor: string;
  highlightColor: string;
  enableAnimation: boolean;
  maxWidth: number;
  route: string;
}
const UserInfoSkeleton = ({
  baseColor,
  highlightColor,
  enableAnimation,
  maxWidth,
  route,
}: IUserInfoSkeleton) => {
  return (
    <>
      {route == "chats" ? (
        <>
          <Skeleton
            width={maxWidth * 0.4}
            className="user-name"
            baseColor={baseColor}
            highlightColor={highlightColor}
            enableAnimation={enableAnimation}
          />
          <Skeleton
            width={maxWidth * 0.65}
            className="user-name"
            baseColor={baseColor}
            highlightColor={highlightColor}
            enableAnimation={enableAnimation}
          />
        </>
      ) : (
        <>
          <Skeleton
            width={maxWidth * 0.4}
            className="user-name"
            baseColor={baseColor}
            highlightColor={highlightColor}
            enableAnimation={enableAnimation}
          />
        </>
      )}
    </>
  );
};

const SkeletonLoad = () => {
  const location = useLocation();
  const route = location.pathname.split("/")[1];
  const { id } = useParams();
  const quarterWidth = (30 / 100) * window.innerWidth;
  const innerWidth = window.innerWidth;
  const maxWidth =
    innerWidth > 700 ? Math.max(quarterWidth, 300) : innerWidth - 50;
  const baseColor = "rgba(105, 109, 140, 0.41)";
  const highlightColor = "#CDCDCD";
  const enableAnimation = false;

  return (
    <>
      <div className={id ? "skeleton-container hide" : "skeleton-container"}>
        {new Array(7).fill(0).map((item, index) => {
          return (
            <div key={index} className="user-container">
              <div className="user">
                <Skeleton
                  width={"54.4px"}
                  circle
                  height={"54.4px"}
                  baseColor={baseColor}
                  highlightColor={highlightColor}
                  enableAnimation={enableAnimation}
                />
                <div
                  className="user-details"
                  style={{
                    flexDirection: route === "users" ? "row" : "column",
                  }}
                >
                  <UserInfoSkeleton
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                    enableAnimation={enableAnimation}
                    maxWidth={maxWidth}
                    route={route}
                  />
                </div>
                {route == "users" && (
                  <Skeleton
                    baseColor={baseColor}
                    highlightColor={highlightColor}
                    enableAnimation={enableAnimation}
                    className="chat-box"
                    style={{ backgroundColor: baseColor }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SkeletonLoad;
