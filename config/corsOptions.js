//Third party middleware
//cross origin resource sharing
const allowedOrigin = require('./allowedOrigin')
const corsOption = {
    origin: (origin, callback) =>{
        if (allowedOrigin.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus:200
}

module.exports = corsOption