const express = require('express')
const router = express.Router()
const {createCategory,getCategory,getCategoryById,listCategory,deleteCategory,updateCategory} = require('../controller/category')
const {isAuth,isAdmin,requireSignin} = require('../controller/auth')
const {userById} = require('../controller/user')

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, createCategory)
router.get('/category/:categoryId', getCategory)
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, updateCategory)
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, deleteCategory)
router.get('/category',listCategory)

router.param("userId", userById)
router.param("categoryId", getCategoryById)

module.exports = router