const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin
} = require("./verifyToken");
const router = require("express").Router();

//CREATE
router.post("/",verifyTokenAndAuth, async (req,res) => {
    const newCart = new Cart(req.body);

    try{
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:cartId", verifyTokenAndAuth, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.cartId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET USER CART
router.get("/find/:userId", verifyTokenAndAuth,async (req, res) => {
    try{
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    } catch(err){
        res.status(500).json(err)
    }
});

//GET ALL CARTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch(err){
        res.status(500).json(err)
    }
});

//DELETE
router.delete("/:cartId", verifyTokenAndAuth, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.cartId);
        res.status(200).json("Cart Deleted..");
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;