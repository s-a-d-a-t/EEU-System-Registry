// ============================================================================
// Authentication Controller
// ----------------------------------------------------------------------------
// Handles user registration.
//
// Flow:
// 1. Receive data from the client
// 2. Validate required fields
// 3. Check if the email already exists
// 4. Hash the user's password
// 5. Save the user to the database
// 6. Return a success response
// ============================================================================

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Will be used later for login
const prisma = require("../config/db");

exports.register = async (req, res) => {
    try {

        // ------------------------------------------------------------
        // Extract user information from the request body
        // ------------------------------------------------------------
        const {
            fullName,
            email,
            password,
            roleId
        } = req.body;

        // ------------------------------------------------------------
        // Basic Validation
        // Ensure all required fields are provided.
        // Without this check, incomplete data could be stored.
        // ------------------------------------------------------------
        if (!fullName || !email || !password || !roleId) {

            return res.status(400).json({
                message: "All fields are required."
            });

        }

        // ------------------------------------------------------------
        // Check whether a user with the same email already exists.
        // Email addresses must be unique.
        // ------------------------------------------------------------
        const existingUser = await prisma.user.findUnique({

            where: {
                email
            }

        });

        if (existingUser) {

            return res.status(409).json({
                message: "Email already exists."
            });

        }

        // ------------------------------------------------------------
        // Hash the password before saving it.
        // Never store plain-text passwords in the database.
        // ------------------------------------------------------------
        const hashedPassword = await bcrypt.hash(password, 10);

        // ------------------------------------------------------------
        // Create the new user in the database.
        //
        // Notice:
        // JavaScript variable  ->  Database field
        // hashedPassword       ->  passwordHash
        // ------------------------------------------------------------
        const user = await prisma.user.create({

            data: {

                fullName,

                email,

                passwordHash: hashedPassword,

                roleId

            }

        });

        // ------------------------------------------------------------
        // Send a success response.
        // Never return passwordHash to the client.
        // ------------------------------------------------------------
        res.status(201).json({

            message: "User created successfully.",

            user: {

                id: user.id,

                fullName: user.fullName,

                email: user.email,

                roleId: user.roleId

            }

        });

    } catch (error) {

        // Log the actual error for debugging.
        console.error(error);

        res.status(500).json({

            message: "Internal server error."

        });

    }
};