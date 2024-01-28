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


const sendTokenandResponse = (statusCode, user, message, req, res) => {
    const token = user.generateJWTtoken(user._id);
    const response = { name: user.name, email: user.email };
    res.status(statusCode)
        .json({ response, message, token });
};



