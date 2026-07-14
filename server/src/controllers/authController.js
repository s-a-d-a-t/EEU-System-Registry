const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");


// Register user
exports.register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            roleId
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !roleId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

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

        // Check if role exists
        const role = await prisma.role.findUnique({
            where: {
                id: Number(roleId)
            }
        });

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role not found."
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
                roleId: Number(roleId)
            }
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                roleId: user.roleId
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


        // Validate login information
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }


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


        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                roleId: user.roleId
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