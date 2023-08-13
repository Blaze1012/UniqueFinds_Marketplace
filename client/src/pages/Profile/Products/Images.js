import { Upload, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { EditProduct, UploadProductImage } from "../../../apicalls/products";
import { set } from "mongoose";

function Images({
  selectedProduct,
  setSelectedProduct,
  setShowProductForm,
  getData,
}) {
  const [showPreview, setShowPreview] = useState(true);
  const [file, setFile] = useState(null);
  const [images, setImages] = useState(selectedProduct.images);
  const dispatch = useDispatch();
  const upload = async () => {
    try {
      dispatch(SetLoader(true));
      //upload images to cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", selectedProduct._id);
      const response = await UploadProductImage(formData);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        setImages([...images, response.data]);
        getData();
        setShowPreview(false);
        setFile(null);
      } else message.error(response.message);
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      const updatedImageArray = images.filter((img) => {
        return img !== image;
      });

      const updatedProduct = { ...selectedProduct, images: updatedImageArray };
      dispatch(SetLoader(true));
      const response = await EditProduct(selectedProduct._id, updatedProduct);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        setImages(updatedImageArray);
        setFile(null);
        getData();
      } else throw new Error(response.message);
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div>
      <div className="flex gap-5 mb-3">
        {images.map((image) => {
          return (
            <div className="flex gap-2 border border-solid border-gray-500 rounded p-2 items-end ">
              <img className="h-20 w-20 object-cover" src={image} alt="" />
              <i
                className="ri-delete-bin-line cursor-pointer "
                onClick={() => deleteImage(image)}
              ></i>
            </div>
          );
        })}
      </div>
      <Upload
        listType="picture"
        beforeUpload={() => false}
        onChange={(info) => {
          setFile(info.file);
          // console.log(info.file);
          setShowPreview(true);
        }}
        fileList={file ? [file] : []}
        showUploadList={showPreview}
      >
        <Button className="border border-gray-600 border-dashed" type="default">
          Upload Image
        </Button>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button
          type="default"
          onClick={() => {
            setShowProductForm(false);
          }}
        >
          Cancel
        </Button>

        <Button type="primary" onClick={upload} disabled={!file}>
          Upload
        </Button>
      </div>
    </div>
  );
}

export default Images;
