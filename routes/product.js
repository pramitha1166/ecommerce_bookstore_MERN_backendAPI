const express = require('express')
const router = express.Router()
const {
    createProduct,
    getProductById,
    readProduct,
    deleteProduct,
    updateProduct,
    listProduct,
    listRelatedProducts,
    listProductCategories,
    listBySearch,
    getProductPhoto
} = require('../controller/product')
const {isAuth,isAdmin,requireSignin} = require('../controller/auth')
const {userById} = require('../controller/user')

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, createProduct)
router.get('/product/:productId', readProduct)
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct)
router.get('/product', listProduct)
router.get('/product/related/:productId', listRelatedProducts)
router.get('/products/categories', listProductCategories)
router.post("/products/by/search", listBySearch);
router.get('/product/photo/:productId', getProductPhoto)

router.param("userId", userById)
router.param("productId", getProductById)

module.exports = router