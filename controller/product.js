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