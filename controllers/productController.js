import Product from "../models/product.js"
import {isAdmin} from "./userController.js"

export async function createProduct(req,res){

    if (!isAdmin(req)){
        res.status(403).json({
            message: "Access denied. Admins only"
            
        })
        return
    }
    /*if (req.user == null){
        res.status(401).json(
            {
                message: "please login and try again"
            }
        )
        return //To stop the function
    }

    if (req.user.role != "admin"){
        res.status(403).json(
            {
                message: "Tou are not authorized to create a product"
            }
        )
        return
    }*/

    try{
        const existingProduct = await Product.findOne({
            productId : req.body.productId
        })
        if (existingProduct){
            res.status(400).json({
                message: "Product with given productId already exists"
            
            })
            return
        }

        const data = {}
        data.productId = req.body.productId

        if (req.body.name == null){
            res.staus(400).json({
                message : "Product name is required"
            })
            return
        }
        data.name = req.body.name
        data.description = req.body.description || ""
        data.altNames = req.body.altNames || ""

        if (req.body.price == null){
            res.status(400).json({
                message : "Product price is essential"
            })
            return
        }
        data.price = req.body.price
        data.labelledPrice = req.body.labelledPrice || req.body.price
        data.catogery = req.body.catogery || "Others"
        data.images = req.body.images || ["/images-default-product-1.png","/images-default-product-2.png"]
        data.isVisible = req.body.isVisible
        data.brand = req.body.brand || "Generic"
        data.model = req.body.model || "Standard"
        //not compoulsary otherwise it has no checkout

        const newProduct = new Product(data)

        await newProduct.save()
        res.status(201).json({
            message: "Product created succesfully"
        })


    }catch(error){
        res.status(500).json({
            message:"Error creating product", error:error
        })
    }
    
}

export async function getProducts(req,res){
    try{
        if (isAdmin(req)){
            const products = await Product.find()
            res.status(200).json(products)
        }else{
            const products = await Product.find()
            res.status(200).json(products)
        }
        
    }catch(error){
        res.status(500).json({
            message : "Error fetching products", error : error
        })
    }
} 

export async function deleteProduct(req,res){
    if (!isAdmin(req)){
        res.status(403).json({
            message:"Access denied. Admins only"
        })
        return
    }
    try {
        const productId = req.params.productId //in url
        await Product.deleteOne({
            productId : productId
        })
        res.status(200).json({
            message : "Product deleted succesfully"
        })
    }catch (error){
        res.status(500).json({
            message : "Error deleting products", error : error
        })
    }
}

export async function updateProduct(req,res){
    if (!isAdmin(req)){
        res.status(403).json({
            message: "Access denied. Admins only"
            
        })
        return
    }
   

    try{
        const productId = req.params.productId
       
        const data = {}
        data.productId = req.body.productId

        if (req.body.name == null){
            res.staus(400).json({
                message : "Product name is required"
            })
            return
        }
        data.name = req.body.name
        data.description = req.body.description || ""
        data.altNames = req.body.altNames || ""

        if (req.body.price == null){
            res.status(400).json({
                message : "Product price is essential"
            })
            return
        }
        data.price = req.body.price
        data.labelledPrice = req.body.labelledPrice || req.body.price
        data.catogery = req.body.catogery || "Others"
        data.images = req.body.images || ["/images-default-product-1.png","/images-default-product-2.png"]
        data.isVisible = req.body.isVisible
        data.brand = req.body.brand || "Generic"
        data.model = req.body.model || "Standard"
        //not compoulsary otherwise it has no checkout

        await Product.updateOne({
            productId : productId
        },data)
        
        res.status(201).json({
            message: "Product updated succesfully"
        })


    }catch(error){
        res.status(500).json({
            message:"Error updating product", error:error
        })
    }
}

export async function getProductById(req,res){
    try{

        const productId = req.params.productId
        const product = await Product.finfOne({
            productId : productId
        })

        if (product == null){
            res.status(404).json({
                message : "Product not found"
            })
            return
        }

        if (!product.isVisible){
            if (!isAdmin(req)){
                res.status(404).json({
                    message : "Product not found"
                })
                return
            }
        }

    }catch(error){
        res.status(500).json({
            message : "Error fetching product",
            error : error
        })

    }
}