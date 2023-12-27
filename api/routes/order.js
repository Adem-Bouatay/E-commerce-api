const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin
} = require("./verifyToken");
const router = require("express").Router();

//CREATE
router.post("/",verifyTokenAndAuth, async (req,res) => {
    const newOrder = new Order(req.body);

    try{
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:OrderId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.OrderId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET USER ORDER
router.get("/find/:userId", verifyTokenAndAuth,async (req, res) => {
    try{
        const Order = await Order.find({userId: req.params.userId});
        res.status(200).json(Order);
    } catch(err){
        res.status(500).json(err)
    }
});

//GET ALL OrderS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const Orders = await Order.find();
        res.status(200).json(Orders);
    } catch(err){
        res.status(500).json(err)
    }
});

//DELETE
router.delete("/:OrderId", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.OrderId);
        res.status(200).json("Order Deleted..");
    } catch(err){
        res.status(500).json(err)
    }
})

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1));

    try{
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte: previousMonth}}},
            { 
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount",
                }
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: "$sales"},
                }
            }
        ]);
        res.status(200).json(income);
    } catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;