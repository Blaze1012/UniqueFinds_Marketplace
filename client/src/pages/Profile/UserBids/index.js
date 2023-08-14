import { Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";

function UserBids() {
  const [bidsData, setBidsData] = useState([]);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        buyer: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) setBidsData(response.data);
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
      dataIndex: "product",
      render: (text, record) => {
        return <p>{record.product.name}</p>;
      },
    },
    {
      title: "Seller",
      dataIndex: "seller",
      render: (text, record) => {
        return <p>{record.seller.name}</p>;
      },
    },
    {
      title: "Offered Price",
      dataIndex: "offeredPrice",
      render: (text, record) => {
        return <p>{record.product.price}</p>;
      },
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Bid Placed On",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(text).format("DD-MM-YYYY hh:mm a");
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <span>
        {bidsData.length > 0
          ? ""
          : "This tab shows the Bids placed by the user on various items.Place a bid on an item from Home Page to be showcased here"}
      </span>
      <Table columns={columns} dataSource={bidsData}></Table>
    </div>
  );
}

export default UserBids;
