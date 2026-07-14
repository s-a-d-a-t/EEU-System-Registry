const prisma = require("../config/db");

const applicationInclude = {
    createdBy: {
        select: {
            id: true,
            fullName: true,
            email: true
        }
    }
};

// Create application
exports.createApplication = async (req, res) => {
    try {
        const {
            name,
            description,
            version
        } = req.body;

        const application = await prisma.application.create({
            data: {
                name,
                description,
                version,
                createdById: req.user.id
            },
            include: applicationInclude
        });

        return res.status(201).json({
            success: true,
            message: "Application created successfully.",
            data: application
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            include: applicationInclude,
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Applications retrieved successfully.",
            data: applications
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Get application by ID
exports.getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await prisma.application.findUnique({
            where: {
                id: Number(id)
            },
            include: applicationInclude
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application retrieved successfully.",
            data: application
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Update application
exports.updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            version
        } = req.body;

        const existingApplication = await prisma.application.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existingApplication) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        // Contributors can only update their own applications
if (
    req.currentUser.role.name === "CONTRIBUTOR" &&
    existingApplication.createdById !== req.currentUser.id
) {
    return res.status(403).json({
        success: false,
        message: "You can only update your own applications."
    });
}

        const data = {};

        if (name !== undefined) data.name = name;
        if (description !== undefined) data.description = description;
        if (version !== undefined) data.version = version;

        const updatedApplication = await prisma.application.update({
            where: {
                id: Number(id)
            },
            data,
            include: applicationInclude
        });

        return res.status(200).json({
            success: true,
            message: "Application updated successfully.",
            data: updatedApplication
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

// Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const existingApplication = await prisma.application.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existingApplication) {
            return res.status(404).json({
                success: false,
                message: "Application not found."
            });
        }

        await prisma.application.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};