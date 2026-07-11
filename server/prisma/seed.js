const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

    // ------------------------------------------------
    // Create Roles
    // ------------------------------------------------

    const roles = [
        "SUPER_ADMIN",
        "ADMIN",
        "CONTRIBUTOR",
        "VIEWER"
    ];

    for (const roleName of roles) {

        await prisma.role.upsert({

            where: {
                name: roleName
            },

            update: {},

            create: {
                name: roleName
            }

        });

    }

    console.log("Roles created successfully");



    // ------------------------------------------------
    // Find SUPER_ADMIN role
    // ------------------------------------------------

    const superAdminRole = await prisma.role.findUnique({

        where: {
            name: "SUPER_ADMIN"
        }

    });



    // ------------------------------------------------
    // Hash password
    // ------------------------------------------------

    const passwordHash = await bcrypt.hash("admin123", 10);



    // ------------------------------------------------
    // Create Admin User
    // ------------------------------------------------

    await prisma.user.upsert({

        where: {
            email: "admin@eeu.com"
        },

        update: {},

        create: {

            fullName: "System Administrator",

            email: "admin@eeu.com",

            passwordHash,

            roleId: superAdminRole.id

        }

    });

    console.log("Admin user created successfully");

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });