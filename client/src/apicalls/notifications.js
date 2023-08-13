import { notification } from "antd";
import { axiosInstance } from "./axiosInstance";

//add notification

export const AddNotification = async (data) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/api/notifications/notify",
      data
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//get all notification by user
export const GetAllNotifications = async () => {
  try {
    const response = await axiosInstance.get(
      "http://localhost:5000/api/notifications/get-all-notifications"
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//delete  notification

export const DeleteNotifications = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:5000/api/notifications/delete-notifications/${id}`
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// read all notification

export const ReadAllNotifications = async () => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:5000/api/notifications/read-all-notifications`
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};
