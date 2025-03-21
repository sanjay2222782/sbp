const jwt = require("jsonwebtoken");
const User = require("../Model/user/user");

const generateMiddleware = (model) => async (req, res, next) => {
    try {
        // Token extract karein (Bearer token format bhi handle karein)
        let token = req.headers.authorization || req.headers.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1]; // Remove "Bearer " prefix
        }

        // Decode token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decode); // Debugging

        // User ko email ya _id ke through find karein
        const user = await model.findOne({ _id: decode.userId }) || await model.findOne({ email: decode.email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Ensure userId is attached
        req.user = { userId: user._id, email: user.email };
        next();
    } catch (error) {
        console.error("Middleware Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const userMiddleware = generateMiddleware(User);

module.exports = {
    userMiddleware
};
