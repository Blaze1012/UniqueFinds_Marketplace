const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      default: [],
      required: true,
    },
    billAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    boxAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    warrantyAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    accessoriesAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
    },
    showBidsOnProductPage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.index({ "$**": "text" });
module.exports = mongoose.model("products", productSchema);
