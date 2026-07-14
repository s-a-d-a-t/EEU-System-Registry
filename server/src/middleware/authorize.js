// Role-based access control.
// The role name is already carried inside the JWT (see authController.login),
// so this is a pure in-memory check — no extra database query per request.
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied."
            });
        }

        next();
    };
};

module.exports = authorize;
