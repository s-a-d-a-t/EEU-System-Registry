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

// UPDATE APPLICATION
exports.updateApplication = async (req, res) => {
    try {
        // Get application ID from URL
        const { id } = req.params;

        const {
            name,
            description,
            version
        } = req.body;

        // ------------------------------------------------------------
        // Check whether application exists
        // ------------------------------------------------------------

        const existingApplication = await prisma.application.findUnique({

            where: {
                id: Number(id)
            }

        });

        if (!existingApplication) {

            return res.status(404).json({

                message: "Application not found."

            });

        }
        // ------------------------------------------------------------
        // Update application
        // ------------------------------------------------------------
        const updatedApplication = await prisma.application.update({

            where: {

                id: Number(id)

            },

            data: {
                name,
                description,
                version
            }

        });

        // ------------------------------------------------------------
        // Return updated application
        // ------------------------------------------------------------

        return res.status(200).json({

            message: "Application updated successfully.",

            application: updatedApplication

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({

            message: "Internal server error."

        });

    }

};
 // delete application
 exports.deleteApplication = async (req,res) => {
     try{
        const {id} = req.params;
        //chk if apk exists
        const existingApplication = await prisma.application.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!existingApplication){
            return res.status(404).json({
                message: "Application not found."
            });
        }

        //delete the application
        await prisma.application.delete({
            where: {
                id: Number(id)
            }
        });
        return res.status(200).json({
            message:"Application deleted successfully."
        });
     }
     catch (error){
        console.error(error);

        return res.status(500).json({
            message:"Internal server error."
        });
     }
};
console.log("Application Controller Loaded");
console.log(module.exports);