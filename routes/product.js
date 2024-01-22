const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuth,
  verifyTokenAndAdmin
} = require("./verifyToken");
const router = require("express").Router();

//CREATE
router.post("/",verifyTokenAndAdmin, async (req,res) => {
    const newProduct = new Product(req.body);

    try{
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:productId", verifyTokenAndAuth, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET PRODUCT
router.get("/find/:productId", async (req, res) => {
    try{
        const product = await Product.findById(req.params.productId);
        res.status(200).json(product);
    } catch(err){
        res.status(500).json(err)
    }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const qBrand = req.query.brand
    try{
        let products;
        if (qNew){ 
            products = await Product.find().sort({_id: -1}).limit(1);
        } else if (qCategory){
            products = await Product.find({categories:{
                $in : [qCategory],
            }});
        } else if (qBrand){
            products = await Product.find({brand:{
                $in : [qBrand],
            }});
        } 
        else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch(err){
        res.status(500).json(err)
    }
});

//DELETE
router.delete("/:productId", verifyTokenAndAdmin, async (req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json("Product Deleted..");
    } catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;