const jwt = require("jsonwebtoken");
const User = require("../module/user.module");

const authMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        // ADD console.log HERE
        console.log("AUTH HEADER:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Extract JWT
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SIGN
        );

        console.log("DECODED TOKEN:", decoded);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {

        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;