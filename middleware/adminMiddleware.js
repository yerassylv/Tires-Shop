const User = require("../models/User");

exports.isAdmin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const user = await User.findById(req.session.userId);

        if (user && user.role === "admin") {
            req.user = user;
            next();
        } else {
            res.status(403).json({ message: "Access denied. Admins only." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error checking admin role" });
    }
};