const prisma = require("../config/db");

const applicationInclude = {
    createdBy: {
        select: {
            id: true,
            fullName: true,
            email: true
        }
    },
    updatedBy: {
        select: {
            id: true,
            fullName: true,
            email: true
        }
    }
};

// Whitelist of allowed sort values → Prisma orderBy (never trust raw input)
const sortOptions = {
    sortOrder: [{ sortOrder: "asc" }, { name: "asc" }],
    name: { name: "asc" },
    newest: { publishedOn: "desc" },
    oldest: { publishedOn: "asc" }
};

// Create application
exports.createApplication = async (req, res) => {
    try {
        const {
            name,
            description,
            version,
            publishedOn,
            developerName,
            appUrl,
            coreFunctionalities,
            frontendStack,
            backendStack,
            iconIndex,
            theme,
            sortOrder,
            status
        } = req.body;

        // Prevent duplicate names, case-insensitive (FR-AR-07)
        const duplicate = await prisma.application.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive"
                }
            }
        });

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "An application with this name already exists."
            });
        }

        const application = await prisma.application.create({
            data: {
                name,
                description,
                version,
                publishedOn: new Date(publishedOn),
                developerName,
                appUrl,
                coreFunctionalities,
                frontendStack: frontendStack || [],
                backendStack: backendStack || [],
                iconIndex,
                theme,
                sortOrder: sortOrder ?? 0,
                ...(status && { status }),
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

// Get all applications (search, filter, sort, paginate)
exports.getAllApplications = async (req, res) => {
    try {
        const {
            q,
            developer,
            theme,
            status,
            sort = "sortOrder",
            page = 1,
            limit = 20
        } = req.query;

        const where = {};

        // Free-text search (FR-SR-01, case-insensitive, partial match)
        if (q) {
            where.OR = [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { developerName: { contains: q, mode: "insensitive" } },
                { coreFunctionalities: { contains: q, mode: "insensitive" } },
                { frontendStack: { has: q } },
                { backendStack: { has: q } }
            ];
        }

        // Filters (FR-SR-02)
        if (developer) {
            where.developerName = { equals: developer, mode: "insensitive" };
        }

        if (theme) {
            where.theme = theme;
        }

        if (status) {
            where.status = status;
        }

        const orderBy = sortOptions[sort] || sortOptions.sortOrder;

        // Pagination (FR-SR-05)
        const pageNumber = Math.max(Number(page) || 1, 1);
        const pageSize = Math.max(Number(limit) || 20, 1);
        const skip = (pageNumber - 1) * pageSize;

        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where,
                include: applicationInclude,
                orderBy,
                skip,
                take: pageSize
            }),
            prisma.application.count({ where })
        ]);

        return res.status(200).json({
            success: true,
            message: "Applications retrieved successfully.",
            data: applications,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                total,
                totalPages: Math.ceil(total / pageSize)
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
            req.user.role === "CONTRIBUTOR" &&
            existingApplication.createdById !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own applications."
            });
        }

        const {
            name,
            description,
            version,
            publishedOn,
            developerName,
            appUrl,
            coreFunctionalities,
            frontendStack,
            backendStack,
            iconIndex,
            theme,
            sortOrder,
            status
        } = req.body;

        // If the name is changing, re-check case-insensitive uniqueness (FR-AR-07)
        if (name && name.toLowerCase() !== existingApplication.name.toLowerCase()) {
            const duplicate = await prisma.application.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: "insensitive"
                    },
                    NOT: {
                        id: Number(id)
                    }
                }
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "An application with this name already exists."
                });
            }
        }

        const data = {
            updatedById: req.user.id
        };

        if (name !== undefined) data.name = name;
        if (description !== undefined) data.description = description;
        if (version !== undefined) data.version = version;
        if (publishedOn !== undefined) data.publishedOn = new Date(publishedOn);
        if (developerName !== undefined) data.developerName = developerName;
        if (appUrl !== undefined) data.appUrl = appUrl;
        if (coreFunctionalities !== undefined) data.coreFunctionalities = coreFunctionalities;
        if (frontendStack !== undefined) data.frontendStack = frontendStack;
        if (backendStack !== undefined) data.backendStack = backendStack;
        if (iconIndex !== undefined) data.iconIndex = iconIndex;
        if (theme !== undefined) data.theme = theme;
        if (sortOrder !== undefined) data.sortOrder = sortOrder;
        if (status !== undefined) data.status = status;

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

// List distinct frontend/backend stack tags for filter UIs (SRS §7 GET /api/tags)
exports.getTags = async (req, res) => {
    try {
        const applications = await prisma.application.findMany({
            select: {
                frontendStack: true,
                backendStack: true
            }
        });

        const frontend = new Set();
        const backend = new Set();

        for (const application of applications) {
            application.frontendStack.forEach((tag) => frontend.add(tag));
            application.backendStack.forEach((tag) => backend.add(tag));
        }

        return res.status(200).json({
            success: true,
            message: "Tags retrieved successfully.",
            data: {
                frontend: [...frontend].sort(),
                backend: [...backend].sort()
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
