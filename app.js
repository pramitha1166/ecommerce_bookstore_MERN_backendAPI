const express = require('express')
const app = express()
require('dotenv').config()
const auth_router = require('./routes/auth')
const user_router = require('./routes/user')
const category_router = require('./routes/category')
const product_router = require('./routes/product')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
const mongoose = require('mongoose')
 

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('DB connected')
})

//app middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

//route middeware
app.use('/api', auth_router)
app.use('/api', user_router)
app.use('/api', category_router)
app.use('/api', product_router)

app.get('', (req,res) => {
    res.json({
        home: "Hello Home"
    })
});

const port = process.env.PORT || 8000

app.listen(port, (err) => {
    if(err) {
        console.log(err)
    }else {
        console.log("Server is running on: ",port)
    }
})
