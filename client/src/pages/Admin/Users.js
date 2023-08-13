import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import moment from "moment";

import { GetAllUser, UpdateUserStatus } from "../../apicalls/users";

function Users() {
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllUser();
      dispatch(SetLoader(false));
      if (response.success) {
        setUsers(response.users);
      } else throw new Error(response.message);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));

      const response = await UpdateUserStatus(id, status);
      dispatch(SetLoader(false));
      if (response.success) {
        getData();
        message.success(response.message);
      } else message.error(response.message);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => {
        return record.role.toUpperCase();
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return record.status.toUpperCase();
      },
    },

    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-3">
            {status === "active" && (
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  onStatusUpdate(_id, "blocked");
                }}
              >
                Block
              </span>
            )}

            {status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  onStatusUpdate(_id, "active");
                }}
              >
                Unblock
              </span>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={users}></Table>
    </div>
  );
}

export default Users;
