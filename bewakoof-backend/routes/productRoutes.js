const express = require("express");
const Product = require("../models/Product");
const authenticateToken = require("../middlewares/authMiddleware");
const errorHandler = require("../middlewares/errorMiddleware");
const validateProduct = require("../middlewares/validateMiddleware");
const {protect, adminOnly} = require("../middlewares/authMiddleware");

const router = express.Router();

//create a new product
router.post("/",protect,adminOnly,validateProduct,async(req,res)=>{
    try{
        const {name,description,price,category,stock,image} = req.body;
        const product = new Product({name,description,price,category,stock,image});
        await product.save();
        res.status(201).json(product);
    }catch(error){
        res.status(500).json({message:"Internal server error",error});
    }
})

//get all products
// Get all products with pagination, filtering, and sorting
router.get("/", async (req, res) => {
    try {
        let { page = 1, limit = 10, category, sort } = req.query;

        // Convert page & limit to numbers
        page = parseInt(page);
        limit = parseInt(limit);

        // Build query object
        let query = {};
        if (category) {
            query.category = category;
        }

        // Sorting logic
        let sortOption = {};
        if (sort === "price_asc") {
            sortOption.price = 1; // Ascending order
        } else if (sort === "price_desc") {
            sortOption.price = -1; // Descending order
        }

        // Fetch products with pagination, filtering, and sorting
        const products = await Product.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        // Count total products for pagination metadata
        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            products
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});


//get a single product
router.get("/:id",async(req,res)=>{
    try{
        const id = req.params.id;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message : "Product not found"});
        }
        res.status(200).json(product);

    }catch(error){
        res.status(500).json({message:"Internal server error",error});
    }
})

//update a product by id
router.put("/:id", protect,adminOnly,validateProduct, async(req,res)=>{
    try{
        const id = req.params.id;
        const updateProduct = await Product.findByIdAndUpdate( id,req.body,{new : true});
        if(!updateProduct){
            return res.status(404).json({message : "Product not found"});
        }
        res.status(200).json(updateProduct);
    }catch(error){
        res.status(500).json({message:"Internal server error",error});
    }
})

//delete a product by id
router.delete("/:id",protect,adminOnly, async(req,res)=>{
    try{
        const id = req.params.id;
        const deleteProduct = await Product.findByIdAndDelete(id);
        if(!deleteProduct){
            return res.status(404).json({message : "Product not found"});
        }
        res.status(200).json(deleteProduct)
        }catch(error){
            res.status(500).json({message:"Internal server error",error});
        
    }
})
module.exports = router;


// const express = require("express");
// const Product = require("../models/Product");
// const { authenticateToken, isAdmin } = require("../middlewares/authMiddleware");
// const validateProduct = require("../middlewares/validateMiddleware");

// const router = express.Router();

// // 🛒 Get all products (Public)
// router.get("/", async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.status(200).json(products);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error });
//     }
// });

// // 🛒 Get a single product (Public)
// router.get("/:id", async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).json({ message: "Product not found" });
//         res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error });
//     }
// });

// // 🔐 Create a product (Only Admin)
// router.post("/", authenticateToken, isAdmin, validateProduct, async (req, res) => {
//     try {
//         const { name, description, price, category, stock, image } = req.body;
//         const product = new Product({ name, description, price, category, stock, image });
//         await product.save();
//         res.status(201).json(product);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error });
//     }
// });

// // 🔐 Update a product (Only Admin)
// router.put("/:id", authenticateToken, isAdmin, validateProduct, async (req, res) => {
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
//         res.status(200).json(updatedProduct);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error });
//     }
// });

// // 🔐 Delete a product (Only Admin)
// router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
//     try {
//         const deletedProduct = await Product.findByIdAndDelete(req.params.id);
//         if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
//         res.status(200).json(deletedProduct);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error });
//     }
// });

// module.exports = router;
