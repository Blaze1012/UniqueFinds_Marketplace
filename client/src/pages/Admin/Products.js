import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import moment from "moment";
import { GetProducts, UpdateProductStatus } from "../../apicalls/products";

function Products() {
  const { user } = useSelector((state) => state.users);

  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(null);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.products);
      } else throw new Error(response.message);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));

      const response = await UpdateProductStatus(id, status);
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
      title: "Product",
      dataIndex: "images",
      render: (text, record) => {
        return (
          <img
            className="h-20 w-20 rounded-md object-cover"
            src={record.images[0]}
            alt=""
          />
        );
      },
    },
    {
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Seller",
      //   dataIndex: "name",
      render: (text, record) => {
        return record.seller.name;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return record.status.toUpperCase();
      },
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    // {
    //   title: "Action",
    //   dataIndex: "action",
    //   render: (text, record) => {
    //     return <div className="flex gap-5"></div>;
    //   },
    // },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;
        return (
          <div className="flex gap-3">
            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  onStatusUpdate(_id, "approved");
                }}
              >
                Approve
              </span>
            )}

            {status === "pending" && (
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  onStatusUpdate(_id, "rejected");
                }}
              >
                Reject
              </span>
            )}

            {status === "approved" && (
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
                  onStatusUpdate(_id, "approved");
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
      <Table columns={columns} dataSource={products}></Table>
    </div>
  );
}

export default Products;
