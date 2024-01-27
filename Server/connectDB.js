const mongoose = require('mongoose')

const connectDB = async () => {
    const reponse = await mongoose.connect(process.env.DB_URI)
    console.log("connected to db")
}

module.exports = connectDB