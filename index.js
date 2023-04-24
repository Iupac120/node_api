require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const credentials = require('./middleware/credentials')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const corOptions = require('./config/corsOptions')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const {verifyJWT} = require('./middleware/verifyJWT')
const connectDB = require('./config/dbConnect')

const PORT = process.env.PORT || 3000

//bodyparser middleware
//app.use(bodyParser)
//custom midddleware logger
// app.use((req,res,next)=>{
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLog.txt')
//     console.log(`${req.method}${req.path}`)
// })
app.use(logger)

app.use(credentials)
app.use(cors(corOptions))
//built-in middleware
//built-in middleware to handle urlencoded known as form data
app.use(express.urlencoded({extended: false}))
//built-in middleware for json data
app.use(express.json())

//middleware
app.use(cookieParser())
//built-in middleare for static files like html, css, image
app.use(express.static(path.join(__dirname,'/public')))
//use css in the subdir
app.use('/subdir',express.static(path.join(__dirname,'/public')))

//routing
app.use('/',require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
//app.use('/subdir', require('./routes/subdir'))
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))


 
        //route handler
        //types of middleware; built-in, custom, third-party
app.get('/hello(.html)?',(req,res,next)=>{
    console.log('Try to log in the hello.html')
    next()
},(req, res)=>{
    res.send('Hello nodejs')
})
app.all('*',(req,res)=>{
    res.status(404)
    if (req.accepts('html')){
        sendFile(path.join(__dirname,'views','404.html'))
    }else if (req.accepts('json')){
        res.json({"error":"404 not found"})
    }else {
        res.type('txt').send('404 not found')
    }
    
})
//Third part middleware
app.use(errorHandler)
//listen to mongoose connection
const start = async() =>{
    try{
        await connectDB(process.env.DATABASE_URI)
        console.log('connected to mongoDB')
        app.listen(PORT, ()=>{
            console.log(`serve is listening to ${PORT}`)
        })
    }catch(err){
        console.log(err)
    }
}

start()