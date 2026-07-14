const jwt = require("jsonwebtoken");

// Attaches req.user when a valid token is present, but does NOT reject the
// request when the token is missing or invalid — the caller is simply treated
// as a guest. Used for public-but-richer-when-authenticated endpoints so that
// guests see only published applications (SRS Guest role).
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            // Invalid/expired token → fall through as a guest
        }
    }

    next();
};

module.exports = optionalAuth;
