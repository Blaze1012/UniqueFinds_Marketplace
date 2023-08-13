import React from "react";
import { useSelector } from "react-redux";

function General() {
  const { user } = useSelector((state) => state.users);
  return (
    <div className="bg-primary h-72 w-4/12 rounded-xl">
      <div className="flex flex-col gap-1 p-5">
        <div className="flex gap-1 items-center justify-between">
          <img
            src="https://res.cloudinary.com/dufl26uv9/image/upload/f_auto,q_auto/zhnpoppaufp7tircsqm5"
            alt=""
            className="p-5 h-40 w-40 border rounded-2xl"
          ></img>
          <span className="p-5 text-white text-2xl mr-20">
            NAME: {user.name}
          </span>
        </div>
        <div className="flex gap-1 justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="p-1 text-white text-xl">EMAIL</h1>
            <span className="p-1 text-white">{user.email}</span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="p-1 text-white text-xl">ROLE</h1>
            <span className="p-1 text-white">{user.role}</span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="p-1 text-white text-xl">STATUS</h1>
            <span className="p-1 text-white">{user.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default General;
