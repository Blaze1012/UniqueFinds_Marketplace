import { Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
import moment from "moment";

function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
  const [bidsData, setBidsData] = useState([]);

  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        product: selectedProduct._id,
      });
      dispatch(SetLoader(false));
      if (response.success) setBidsData(response.data);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      getData();
    }
  }, [selectedProduct]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return <p>{record.buyer.name}</p>;
      },
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Bid Date",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(text).format("DD-MM-YYYY hh:mm a");
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "COntact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            <p>Phone:{record.mobile}</p>
            <p>Email:{record.buyer.email}</p>
          </div>
        );
      },
    },
  ];
  return (
    <Modal
      title="Bids"
      open={showBidsModal}
      onCancel={() => {
        setShowBidsModal(false);
      }}
      centered
      width={1200}
      footer={false}
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-xl text-primary">
          Product Name:{selectedProduct.name}
        </h1>

        <Table columns={columns} dataSource={bidsData}></Table>
      </div>
    </Modal>
  );
}

export default Bids;
