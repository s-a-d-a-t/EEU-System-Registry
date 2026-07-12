const prisma = require("../config/db");

exports.createApplication = async (req,res) => {
   try{
    const {
        name,
        description,
        version
    } = req.body;

    //validate required fields

    if (!name || !description || !version){
        return res.status(400).json({
            message: "All fields are required."
        });
    }
    //create application

    const application = await prisma.application.create({
        data:{
            name,
            description,
            version,
            createdById: req.user.id
        }
    });

    return res.status(201).json({
        message: "Application created successfully.",application
    });
   }
   catch(error){
 console.error(error);

        return res.status(500).json({

            message: "Internal server error."

        });
   }
};

//get all applications

exports.getAllApplications = async (req,res) => {
    try{
         const applications = await prisma.application.findMany({

            include: {

                createdBy: {

                    select: {

                        id: true,

                        fullName: true,

                        email: true

                    }

                }

            },

            orderBy: {

                createdAt: "desc"

            }

        });

        // ------------------------------------------------------------
        // Return applications
        // ------------------------------------------------------------

        return res.status(200).json({

            applications

        });

    }
    catch (error){
         console.error(error);

        return res.status(500).json({
            message: "Internal server error."
        });

    }
};

exports.getApplicationsById = async (req,res) => {
    try{
        const {id} = req.params;

        const application = await prisma.application.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                createdBy: {
                    select:{
                        id:true,
                        fullName:true,
                        email:true
                    }
                }
            }
        });

        if(!application){
            return res.status(404).json({
                message: "Application not found."
            });
        }
        return res.status(200).json({
            application
            
        });
    }
    catch(error){
        console.error(error);

        return res.status(500).json({

            message: "Internal server error."

        });

    }
};
console.log("Application Controller Loaded");
console.log(module.exports);