const express = require('express')
const router = express.Router()
const {createProduct,getProductById,readProduct,deleteProduct,updateProduct} = require('../controller/product')
const {isAuth,isAdmin,requireSignin} = require('../controller/auth')
const {userById} = require('../controller/user')

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, createProduct)
router.get('/product/:productId', readProduct)
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct)

router.param("userId", userById)
router.param("productId", getProductById)

module.exports = router