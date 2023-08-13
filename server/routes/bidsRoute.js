const router = require("express").Router();
const Bid = require("../models/bidModal");
const auth = require("../middlewares/authMiddleware");

//place new bid

router.post("/place-new-bid", auth, async (req, res) => {
  try {
    const newBid = new Bid(req.body);
    await newBid.save();
    res.send({
      success: true,
      message: "Bid Placed Successfully",
    });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

//get all bids

router.post("/get-all-bids", auth, async (req, res) => {
  try {
    const { product, seller, buyer } = req.body;
    let filters = {};
    if (product) filters.product = product;

    if (seller) filters.seller = seller;

    if (buyer) filters.buyer = buyer;

    const bids = await Bid.find(filters)
      .populate("buyer")
      .populate("product")
      .populate("seller")
      .sort({ createdAt: -1 });

    res.send({
      success: true,
      message: "Bids in Database",
      data: bids,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
