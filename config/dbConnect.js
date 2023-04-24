const mongoose = require('mongoose')

const connectDB = async(uri) => {
        return mongoose.connect(uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
}

module.exports = connectDB