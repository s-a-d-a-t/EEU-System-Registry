const bcrypt = require("bcrypt");
const prisma = require("../config/db");

const userSelect = {
    id: true,
    fullName: true,
    email: true,
    isActive: true,
    createdAt: true,
    role: {
        select: {
            id: true,
            name: true
        }
    }
};

// Create user (admin action) — role is chosen here, unlike public registration
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, roleId } = req.body;

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

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                passwordHash,
                roleId: Number(roleId)
            },
            select: userSelect
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: userSelect,
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully.",
            data: users
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }

};

//getting user by id

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            },
            select: userSelect
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved successfully.",
            data: user
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }

};

//update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const { fullName, email, roleId, isActive } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use."
                });
            }
        }

        if (roleId !== undefined) {
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
        }

        const data = {};

        if (fullName !== undefined) data.fullName = fullName;
        if (email !== undefined) data.email = email;
        if (roleId !== undefined) data.roleId = Number(roleId);
        if (isActive !== undefined) data.isActive = isActive;

        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data,
            select: userSelect
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: updatedUser
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

//delete user
exports.deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const applicationCount = await prisma.application.count({
            where: {
                createdById: Number(id)
            }
        });

        if (applicationCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete user because they own applications. Deactivate the account instead."
            });
        }

        await prisma.user.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};
