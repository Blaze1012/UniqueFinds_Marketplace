const express = require("express");

const router = express.Router();
const Product = require("../models/productModel");
const auth = require("../middlewares/authMiddleware");
const cloudinary = require("../config/cloudinaryConfig");
const multer = require("multer");
//add a new product
const User = require("../models/userModel");
const Notification = require("../models/notificationsModel");
router.post("/add-product", auth, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();

    //send notification to admin
    const admins = await User.find({ role: "admin" });
    admins.forEach(async (admin) => {
      const user1 = await User.find({ _id: req.body.userId });

      const Newnotification = new Notification({
        user: admin._id,
        message: `New product added from ${user1[0].name}`,
        title: `New Product`,
        onClick: "/admin",
        read: false,
      });

      await Newnotification.save();
    });

    res.send({
      success: true,
      message: "product added successfully",
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

//get all products

router.post("/get-products", auth, async (req, res) => {
  try {
    const { seller, category = [], age = [], status, search } = req.body;
    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    if (status) {
      filters.status = status;
    }
    //filter by category

    if (category.length > 0) {
      filters.category = { $in: category };
    }

    //filter by age
    let min, max;
    if (age.length > 0) {
      age.forEach((age, index) => {
        if (index == 0) {
          min = age.split("-")[0];
          max = age.split("-")[1];
        }
        const fromAge = age.split("-")[0];
        if (fromAge < min) min = fromAge;

        const toAge = age.split("-")[1];
        if (toAge > max) max = toAge;
      });
      filters.age = { $gte: min, $lte: max };
    }

    //search

    if (search) {
      searchObject = {
        $search: search,
      };

      filters.$text = searchObject;
    }
    // console.log(`Filters:`, filters);
    const products = await Product.find(filters)
      .populate("seller")
      .sort({ createdAt: -1 });

    res.send({
      success: true,
      message: "Products in database",
      products,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

//edit a product
router.put("/edit-product/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);

    res.send({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get a product by id

router.get("/get-product-by-id/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller");

    res.send({
      success: true,
      message: "Product found in database",
      data: product,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

//delete a product
router.delete("/delete-product/:id", auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

//get image from pc
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, String(Date.now()) + file.organisation);
  },
});

router.post(
  "/upload-image-to-product",
  auth,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      //upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mp",
      });

      const productId = req.body.productId;
      await Product.findByIdAndUpdate(productId, {
        $push: { images: result.secure_url },
      });

      res.send({
        success: true,
        message: "image uploaded successfully",
        data: result.secure_url,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  }
);

//update product status
router.put("/update-product-status/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`Id:${req.params.id} end`);
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
      status,
    });

    //send notification to seller who added the product

    const newNotification = new Notification({
      user: updatedProduct.seller,
      message: `Your product ${updatedProduct.name} has been ${status}`,
      title: `Product Status Updated`,
      read: false,
      onClick: `/profile`,
    });
    await newNotification.save();

    res.send({
      success: true,
      message: "Product Status Updated",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;
