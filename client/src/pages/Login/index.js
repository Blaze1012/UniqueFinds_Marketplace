import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";

const rules = [
  {
    required: true,
    message: "required",
  },
]; //rules for inputting data from user..used in form items component

function Login() {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      const response = await LoginUser(values);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "http://localhost:3000/";
      } else throw new Error(response.message);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const navigate = useNavigate();
  //if token is set already then navigate to homepage
  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/");
  }, []);

  return (
    <div className="h-screen bg-primary flex justify-center items-center bg-[url('https://res.cloudinary.com/dufl26uv9/image/upload/f_auto,q_auto/yu0qsddq7onkjkvdv7yb')] bg-cover bg-opacity-25">
      <div className="bg-white p-5 rounded w-[450px]">
        <h2 className="text-primary text-2xl">
          UniqueFinds <span className="text-gray-400 text-2xl">- Login</span>
        </h2>

        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email:" name="email" rules={rules}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item label="Password:" name="password" rules={rules}>
            <Input type="password" placeholder="Password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
          <div className="mt-5 text-center">
            <span className="text-gray-500">
              Dont't have an account?
              <Link to="/register" className="text-primary ml-2">
                Register
              </Link>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
