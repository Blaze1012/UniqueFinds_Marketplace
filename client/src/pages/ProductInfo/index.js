import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllBids,
  GetProductById,
  GetProducts,
} from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { Button, Modal, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Divider from "../../components/Divider";
import moment from "moment";
import BidModel from "./BidModel";

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectdImage] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id });

        setProduct({ ...response.data, bids: bidsResponse.data });
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    product && (
      <div>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {/*Images*/}
          <div className="flex flex-col gap-5">
            <img
              src={product.images[selectedImage]}
              alt=""
              className="w-full h-96 object-contain rounded-md"
            ></img>

            <div className="flex gap-5">
              {product.images.map((image, index) => {
                return (
                  <img
                    className={
                      "h-20 w-20 object-cover rounded cursor-pointer " +
                      (selectedImage === index
                        ? " border-2 border-green-700/75  border-solid s"
                        : "")
                    }
                    onClick={() => {
                      setSelectdImage(index);
                    }}
                    src={image}
                    alt=""
                  ></img>
                );
              })}
            </div>

            <div>
              <h1 className="text-gray-600">Added On</h1>
              <span className="text-gray-600">
                {moment(product.createdAt).format("DD-MM-YYYY hh:mm A")}
              </span>
            </div>
          </div>

          {/*Details*/}
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-orange-900 mb-2">
                {product.name}
              </h1>
              <span>{product.description}</span>
            </div>
            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-Semibold text-orange-900">
                Product Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Price</span>
                <span>$ {product.price}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Category</span>
                <span className="uppercase">{product.category}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Bill Available</span>
                <span>{product.billAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Box Available</span>
                <span>{product.boxAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Warranty Available</span>
                <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Year of Purchase</span>
                <span>
                  {moment().subtract(product.age, "years").format("YYYY")}
                </span>
              </div>
            </div>

            <Divider />
            <div className="flex flex-col">
              <h1 className="text-2xl font-Semibold text-orange-900">
                Seller Details
              </h1>
              <div className="flex justify-between mt-2">
                <span>Name</span>
                <span>{product.seller.name}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Email</span>
                <span>{product.seller.email}</span>
              </div>
            </div>
            <Divider />
            <div className="flex flex-col">
              <div className="flex justify-between mb-2">
                <h1 className="text-2xl font-semibold text-orange-900">Bids</h1>
                <Button
                  onClick={() => {
                    setShowAddNewBid(!showAddNewBid);
                  }}
                  disabled={product.seller._id === user._id}
                >
                  New Bid
                </Button>
              </div>

              {product.showBidsOnProductPage &&
                product.bids.map((bid) => {
                  return (
                    <div className="border border-gray-300 border-solid p-2 rounded mt-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Name:</span>
                        <span>{bid.buyer.name}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Bid Amount:</span>
                        <span>${bid.bidAmount}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Placed On:</span>
                        <span>
                          {" "}
                          {moment(bid.createdAt).format("MMM D , YYYY hh:mm A")}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <BidModel
          product={product}
          reloadData={getData}
          showBidModal={showAddNewBid}
          setShowBidModal={setShowAddNewBid}
        />
      </div>
    )
  );
}

export default ProductInfo;
