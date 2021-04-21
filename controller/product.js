const { errorHandler } = require('../helper/dbErrorHandler')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const Product = require('../model/product')

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        const {name,description,price,category,quantity,shipping} = fields;

        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            })
        }

        let product = new Product(fields)

        if(files.photo) {
          //  console.log("FILES PHOTO: ", files.photo)

            if(files.photo.size>1000000) {
                return res.status(400).json({
                    error: 'Image shoul be less than 1mb in size'
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }


        product.save((err,product) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(product)
        })

    })
}

exports.getProductById = (req,res,next,id) => {
    Product.findById(id).exec((err,product) => {
        if(err||!product) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.product = product;
        next();
    })
}

exports.readProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

exports.deleteProduct = (req,res) => {
    const product = req.product
    product.remove((err,deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            deletedProduct,
            "message": "Product has been deleted"
        })
    })
}

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        const {name,description,price,category,quantity,shipping} = fields;

        if(!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            })
        }

        let product = req.product
        product = _.extend(product, fields)

        if(files.photo) {
          //  console.log("FILES PHOTO: ", files.photo)

            if(files.photo.size>1000000) {
                return res.status(400).json({
                    error: 'Image shoul be less than 1mb in size'
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }


        product.save((err,product) => {
            if(err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({
                product,
                "Message": 'Product updated successfully'
            })
        })

    })

} 

exports.listProduct = (req,res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit): 6;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err,products) => {
            if(err){
                return res.status(400).json({
                    error: 'Product not found'
                })
            }
            res.json(products)
        })

}

exports.listRelatedProducts = (req,res) => {
    let limit = req.query.limit ? parseInt(req.query.limit): 6;

    Product.find({_id: {$ne: req.product}, category: req.product.category})
        .limit(limit)
        .populate('category', '_id name')
        .exec((err,products) => {
            if(err) {
                return res.status(400).json({
                    error: 'Product not found'
                })
            }
            res.json(products)
        })

}

exports.listProductCategories = (req,res) => {
    Product.distinct("category", {}, (err,categories) => {
        if(err) {
            return res.status(400).json({
                error: 'Categories not found'
            })
        }
        res.json(categories)
    })
}

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.getProductPhoto = (req,res,next) => {
    if(req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}