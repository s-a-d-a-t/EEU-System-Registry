const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

// Public self-registration (for contributors).
// Always creates a CONTRIBUTOR that is INACTIVE (pending admin approval);
// the client cannot choose a role. Elevated/other accounts are created by a
// Super Admin via POST /api/users. General staff read the catalog as guests
// and do not need to register.
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

        // Force the CONTRIBUTOR role — never trust a client-supplied role
        const contributorRole = await prisma.role.findUnique({
            where: {
                name: "CONTRIBUTOR"
            }
        });

        if (!contributorRole) {
            return res.status(500).json({
                success: false,
                message: "Default role is not configured. Run the seed script."
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user — inactive until an admin approves the account
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash: hashedPassword,
                roleId: contributorRole.id,
                isActive: false
            }
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful. Your account is pending admin approval.",
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: contributorRole.name,
                isActive: user.isActive
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

        // Inactive accounts cannot log in — either pending admin approval
        // (newly self-registered contributor) or deactivated (FR-UM-07)
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive or pending admin approval. Please contact an administrator."
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
