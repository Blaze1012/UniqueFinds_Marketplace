import { Form, Input, Modal, message } from "antd";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlaceNewBid } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { AddNotification } from "../../apicalls/notifications";

function BidModel({ product, reloadData, showBidModal, setShowBidModal }) {
  const { user } = useSelector((state) => state.users);
  const FormRef = useRef(null);
  const dispatch = useDispatch();
  const rules = [
    {
      required: true,
      message: "Required",
    },
  ];
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      const payload = {
        ...values,
        product: product._id,
        seller: product.seller._id,
        buyer: user._id,
      };
      const response = await PlaceNewBid(payload);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        //send notification to seller
        await AddNotification({
          title: "New Bid Placed",
          message: `A new bid has been placed on your product ${product.name} by ${user.name} for ${values.bidAmount}`,
          user: product.seller._id,
          onClick: "/profile",
          read: false,
        });
        reloadData();
        setShowBidModal(false);
      } else throw new Error(response.message);
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoader(false));
    }
  };
  return (
    <Modal
      open={showBidModal}
      onCancel={() => {
        setShowBidModal(false);
      }}
      centered
      width={800}
      onOk={() => FormRef.current.submit()}
    >
      <div className="flex flex-col gap-5 mb-5">
        <h1 className="text-2xl font-semibold text-orange-900 text-center">
          New Bid
        </h1>
        <Form layout="vertical" ref={FormRef} onFinish={onFinish}>
          <Form.Item label="Bid Amount" name="bidAmount" rules={rules}>
            <Input type="Number"></Input>
          </Form.Item>
          <Form.Item label="Message" name="message" rules={rules}>
            <Input type="Text"></Input>
          </Form.Item>
          <Form.Item label="Mobile No" name="mobile" rules={rules}>
            <Input type="Number"></Input>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default BidModel;
