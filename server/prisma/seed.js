const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");


const prisma = new PrismaClient();


async function main(){

    // Create roles

    const roles = [
        "SUPER_ADMIN",
        "ADMIN",
        "CONTRIBUTOR",
        "VIEWER"
    ];


    for(const roleName of roles){

        await prisma.role.upsert({

            where:{
                name: roleName
            },

            update:{},

            create:{
                name: roleName
            }

        });

    }


    console.log("Roles created");


    // Find SUPER_ADMIN role

    const adminRole = await prisma.role.findUnique({

        where:{
            name:"SUPER_ADMIN"
        }

    });


    // Create first admin user

    const hashedPassword =
    await bcrypt.hash("admin123",10);



    await prisma.user.upsert({

        where:{
            email:"admin@eeu.com"
        },


        update:{},


        create:{

            username:"admin",

            email:"admin@eeu.com",

            password:hashedPassword,

            roleId:adminRole.id

        }

    });


    console.log("Admin user created");

}



main()

.catch((error)=>{

    console.error(error);

    process.exit(1);

})


.finally(async()=>{

    await prisma.$disconnect();

});