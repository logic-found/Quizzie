const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../schema/User");

exports.register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name)
        res.status(400).json({
            message: "Enter name, email and password to register",
        });
    else {
        const newUser = new User({ name, email, password });
        const user = await newUser.save();
        sendTokenandResponse(201, user, "User created", req, res);
    }
});

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        res.status(400).json({ message: "Enter email & password to login" });

    const user = await User.findOne({ email });
    if (!user) res.status(400).json({ message: "Invalid email or password" });
    else {
        const passwordMatched = await user.comparePassword(password);
        if (passwordMatched) {
            sendTokenandResponse(200, user, "Logged In", req, res);
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    }
});

exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie('token', '', {expires : new Date(0), httpOnly : true})
    res.status(200).json({message : "Logged Out"})
})

const sendTokenandResponse = (statusCode, user, message, req, res) => {
    const token = user.generateJWTtoken(user._id);
    const options = {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        sameSite: "None",
    };
    const response = { name: user.name, email: user.email };
    res.status(statusCode)
        .cookie("token", token, options)
        .json({ response, message });
};




exports.dummy = catchAsyncError(async(req, res) => {
    const user = await User.find();
    res.status(200).json({response : user})
    
})
