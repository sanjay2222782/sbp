

const { statuscode, message, catchcode,  } = require("../../../statuscode");
const product = require("../../Model/user/product");
const shop = require("../../Model/user/shop");
const cart = require("../../Model/user/cart");


const addproduct = async (req, res) => {
    try {
        const { shopid } = req.body;

        // Verify shop exists & is approved
        const verifyshop = await shop.findById(shopid);
        if (!verifyshop) {
            return res.status(404).send({
                success: false,
                message: "Shop not found",
                status: statuscode.NOT_FOUND
            });
        }
        if (verifyshop.verify !== "approved") {
            return res.status(400).send({
                success: false,
                message: "First you need to approve your shop",
                status: statuscode.BAD_REQUEST
            });
        }

        // Calculate Offer Price
        const getOfferPrice = (actualPrice, discountPercent) => {
            let discountAmount = (actualPrice * discountPercent) / 100;
            return actualPrice - discountAmount;
        };
        const offerPrice = getOfferPrice(req.body.price, req.body.discount);

        // Handle multiple or single image upload
        let images = [];

        if (req.files) {
            images = req.files.map(file => `/uploads/user/product/${file.filename}`);
        } else if (req.file) {
            images = [`/uploads/user/product/${req.file.filename}`];
        }

        // Create Product
        const data = await product.create({
            name: req.body.name,
            shopid: req.body.shopid,
            size: req.body.size,
            color: req.body.color,
            category: req.body.category,
            subcategory: req.body.subcategory,
            batchNo: req.body.batchNo,
            price: req.body.price,
            description: req.body.description,
            title: req.body.title,
            rating: req.body.rating,
            qnty: req.body.qnty,
            discount: req.body.discount,
            offerprice: offerPrice,
            images: images // Save multiple images as an array
        });

        return res.status(201).send({
            success: true,
            message: "Product added successfully",
            status: statuscode.CREATED,
            data: data
        });

    } catch (error) {
        console.error("Error in addproduct:", error);
        return res.send(catchcode);
    }
};

const updateproduct = async (req, res) => {
    try {
        const { id, discount, ...otherFields } = req.body; // Extracting id, discount & other fields
        const productData = await product.findById(id); // Correct findById syntax

        if (!productData) {
            return res.send({
                success: false,
                message: "This product does not exist",
                status: statuscode.NOT_FOUND
            });
        }

        let actualPrice = productData.price;
        let discountPercent = discount !== undefined ? discount : productData.discount; 
        const getOfferPrice = (actualPrice, discountPercent) => {
            let discountAmount = (actualPrice * discountPercent) / 100;
            return actualPrice - discountAmount;
        };

        let offerPrice = getOfferPrice(actualPrice, discountPercent);

        
        const updateData = {
            ...otherFields, 
            discount: discountPercent,
            offerprice: offerPrice 
        };

       
        const updatedProduct = await product.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).send({
            message: "Product updated successfully",
            success: true,
            status: statuscode.OK,
            data: updatedProduct
        });

    } catch (error) {
        console.error("Error in addremoveoffer:", error);
        return res.status(500).send(catchcode);
    }
};

// get product list by category 
const catproduct  =async(req,res)=>{
    try {
        const data = await product.find({category:req.body.category})
        return res.send({
            message :"product list successfully fatched",
            success:true,
            status:statuscode.OK,
             data : data 
        })
    } catch (error) {
        return res.send(catchcode);
    }
}
// get product list by category 
const subcatproduct  =async(req,res)=>{
    try {
        const data = await product.find({subcategory:req.body.subcategory})
        return res.send({
            message :"product list successfully fatched",
            success:true,
            status:statuscode.OK,
             data : data 
        })
    } catch (error) {
        return res.send(catchcode);
    }
}
// detailsproduct for cart 
const cartproduct = async(req,res)=>{
    try {
        const {name,shopid}=req.body 
    
    const exist =await product.find({
        $and:[
            {name:name},
            {shopid:shopid}
        ]
    })
    return res.send({
        message :"product successfully get", 
        status:statuscode.OK,
        success:true,
        data :exist,
    })
    } catch (error) {
        console.log(error.message)
        return res.send(catchcode)
    }
}
// add to cart 
const addtocart =async(req,res)=>{
    try {
        const{shopid,qnty,size,color,name}= req.body
    const {_id} =req.user 
    const data = await product.findOne({
        $and:[
          {shopid:shopid},
          {size:size},
          {color:color},
          {name:name}
        ]
    })
    if(data){
        // console.log(data.qnty)
        // console.log(qnty)
       if (data.qnty>=qnty) {
        const price= (data.offerprice)*(qnty) 
        console.log(typeof(data.offerprice));
        console.log(typeof(qnty));
        console.log(data.offerprice);

        
        const cartproduct = await cart.create({
            userid:_id,
            productid:data._id,
            qnty:qnty,
            price:price

        })

        return res.send({
            message:`${qnty}${name} is succfully add your cart`, 
            success: true, 
            status:statuscode.OK,
            data: cartproduct
        })
       } else {
        return res.send({
            message : `${qnty} is not available`, 
            success: false,
            status:statuscode.BAD_REQUEST
        })
       }
    }
    } catch (error) {
        console.log(error.message)
        return res.send(catchcode)
    }

}

// buy product 
const buyproduct = async(req,res)=>{
    try {
        const {_id}= req.user
        const {shopid ,name, size,color,qnty}=req.body
        const data = product.findOne({
            $and:[
                {shopid:shopid},
                {name: name},
                {size:size},
                {color:color},
                {qnty:qnty},

            ]
        })
        if(data){
            const updateShopProduct = await data.qnty-qnty
            console.log(updateShopProduct)
            return res.send({
                message : `you buy ${data.name}`,
                success :true,
                data:data
            })
        }else{
            return res.send({
                message : `This product is not unavailable`,
                success:false, 
                status : statuscode.NOT_FOUND
            })
        }
        
    } catch (error) {
        console.log(error.message);
        return res.send(catchcode)
        
    }
}
module.exports = {addproduct, updateproduct,catproduct,subcatproduct, cartproduct,addtocart , buyproduct}
