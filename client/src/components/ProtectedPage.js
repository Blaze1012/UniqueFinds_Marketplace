import React, { useEffect, useState } from "react";
import {
  GetCurrentUser,
  GetGoogleUser,
  LogoutGoogleUser,
} from "../apicalls/users";
import { Avatar, Badge, Carousel, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { SetUser } from "../redux/userSlice";
import Notifications from "./Notifications";
import {
  GetAllNotifications,
  ReadAllNotifications,
} from "../apicalls/notifications";

// check for token in localstorage, then validates if it is correct.If yes ,then render the children components
function ProtectedPage({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateGoogleToken = async () => {
    try {
      dispatch(SetLoader(true));

      const response = await GetGoogleUser();
      dispatch(SetLoader(false));
      if (response.success) {
        localStorage.setItem("token", response.data);
        // dispatch(SetUser(response.data));
        // navigate("/");
        window.location.reload();
      } else {
        navigate("/login");
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      navigate("/login");
      message.error(error.message);
    }
  };
  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetCurrentUser();
      dispatch(SetLoader(false));
      if (response.success) dispatch(SetUser(response.data));
      else {
        navigate("/login");
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      navigate("/login");
      message.error(error.message);
    }
  };

  const GetNotifications = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllNotifications();
      dispatch(SetLoader(false));
      if (response.success) setNotifications(response.data);
      else throw new Error(response.message);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const readNotifications = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await ReadAllNotifications();
      dispatch(SetLoader(false));
      if (response.success) GetNotifications();
      else throw new Error(response.message);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      GetNotifications();
    } else {
      validateGoogleToken();
      if (!localStorage.getItem("token")) {
        navigate("/login");
        message.error("Please Login to Continue");
      }
    }
  }, []);

  useEffect(() => {
    console.log(showNotifications);
  }, [showNotifications]);

  return (
    user && (
      <div>
        {/*Header */}
        <div className="flex justify-between items-center bg-primary p-5 h-20">
          <div className="flex bg-primary items-center gap-2">
            <img
              className="h-16 w-16"
              src="https://res.cloudinary.com/dufl26uv9/image/upload/f_auto,q_auto/v1/mp/qgkl8inlcgkz07ojqzvb"
              alt=""
            />
            <h1
              className="text-2xl text-white cursor-pointer"
              onClick={async () => {
                const response = await LogoutGoogleUser();
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              {" "}
              UniqueFinds
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="bg-white py-2 px-5 rounded shadow-md items-center">
              <span
                className=" cursor-pointer uppercase mr-2"
                onClick={() => {
                  if (user.role === "user") navigate("/profile");
                  else navigate("/admin");
                }}
              >
                {user.name}{" "}
              </span>

              <Badge
                count={
                  notifications.filter((notification) => !notification.read)
                    .length
                }
                className="cursor-pointer"
                onClick={() => {
                  readNotifications();
                  setShowNotifications(true);
                }}
              >
                <Avatar
                  shape="circle"
                  icon={<i className="ri-notification-2-line"></i>}
                />
              </Badge>
            </div>
            <div className="flex bg-white py-2 px-5 rounded gap-2 items-center shadow-md">
              {/* <i
              className="ri-user-fill cursor-pointer"
              onClick={() => {
                if (user.role === "user") navigate("/profile");
                else navigate("/admin");
              }}
            ></i> */}

              <i
                className="ri-logout-circle-r-line cursor-pointer"
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
              ></i>
            </div>
          </div>
        </div>

        {/*body */}
        <div className="p-5">{children}</div>

        {showNotifications && (
          <Notifications
            notifications={notifications}
            reloadNotifications={GetNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          ></Notifications>
        )}
      </div>
    )
  );
}

export default ProtectedPage;
