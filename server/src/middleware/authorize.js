const prisma = require("../config/db");

const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.id
                },
                include: {
                    role: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                });
            }

            if (!allowedRoles.includes(user.role.name)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied."
                });
            }

            req.currentUser = user;

            next();

        } catch (error) {
            console.error("Authorization Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error."
            });
        }
    };
};

module.exports = authorize;