const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new Schema({
    name: { type: String, required: [true, "Please enter user name"] },
    email: {
        type: String,
        required: [true, "Please enter user email"],
        unique: [true, "Email already registered"]
    },
    password: { type: String, required: [true, "Please enter user password"] },
})


schema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
})

schema.methods.generateJWTtoken = function (userId) {
    const options = {
        expiresIn: process.env.JWT_EXPIRE
    }
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, options)
}
schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}



module.exports = mongoose.model('User', schema)
