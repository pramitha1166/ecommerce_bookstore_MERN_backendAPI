const { errorHandler } = require('../helper/dbErrorHandler')
const Category = require('../model/category')

exports.createCategory = (req,res) => {
    console.log(req.body)
    const category = new Category(req.body)
    category.save((err,category) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({category})
    })
}


exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,category) => {
        if(err||!category) {
            return res.status(400).json({
                error: 'Category not found'
            })
        }
        req.category = category
        next();
    })
}

exports.deleteCategory = (req,res) => {
    const category = req.category;
    category.remove((err,deletedCategory) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            deletedCategory,
            'message': 'Category has been deleted'
        })
    })
}

exports.updateCategory = (req,res) => {
    const category = req.category
    category.name = req.body.name
    category.save((err,category) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            category,
            'message': 'Category has been updated successfully'
        })
    })
}

exports.getCategory = (req,res) => {
    return res.json(req.category)
}

exports.listCategory = (req,res) => {
    Category.find().exec((err,data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data)
    })
}