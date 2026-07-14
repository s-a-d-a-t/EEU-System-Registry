const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

// Public self-registration.
// Always creates the lowest-privilege role (VIEWER); the client cannot
// choose a role here. Elevated accounts are created by a Super Admin via
// POST /api/users. This closes the privilege-escalation hole.
exports.register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password
        } = req.body;

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        // Force the default VIEWER role — never trust a client-supplied role
        const viewerRole = await prisma.role.findUnique({
            where: {
                name: "VIEWER"
            }
        });

        if (!viewerRole) {
            return res.status(500).json({
                success: false,
                message: "Default role is not configured. Run the seed script."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash: hashedPassword,
                roleId: viewerRole.id
            }
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: viewerRole.name
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


// Login user
exports.login = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            include: {
                role: true
            }
        });

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Deactivated accounts cannot log in (FR-UM-07)
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated."
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Create JWT token — role name is embedded so RBAC needs no DB lookup
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name
            }
        });

    } catch (error) {

        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};


// Logout — with stateless JWT the client simply discards the token.
// Endpoint kept for API completeness (SRS §7). Refresh-token invalidation
// is a future enhancement (FR-UM-05).
exports.logout = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logout successful. Please discard your token."
    });
};
