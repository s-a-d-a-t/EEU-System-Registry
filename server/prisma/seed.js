const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

    // Create default system roles
    await prisma.role.createMany({
        data: [
            {
                name: "SUPER_ADMIN"
            },
            {
                name: "ADMIN"
            },
            {
                name: "CONTRIBUTOR"
            },
            {
                name: "VIEWER"
            }
        ],
        skipDuplicates: true
    });

    console.log("Roles seeded successfully");
}


main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });