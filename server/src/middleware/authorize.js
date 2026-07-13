const prisma = require("../db");

const authorize = (...allowedRoles) => {
    return async (req,res,next) => {
        try{
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.id
                },

                include: {
                    role: true
                }
            });

            if (!user){
                return res.staus(404).json({
                    message: "User not found."
                });
            }

            if (!allowedRoles.include(user.role.name)){
                return res.status(403).json({
                    message: "Access denied."
                });
            }
            next();

        }
        catch(error){
            console.error(error);

            return res.status(500).json({

                message: "Internal server error."

            });

        }
    };
};

// delete user
exports.deleteUser = async (req,res) => {
    try{
        const {id} = req.params;

        const user = await prisma.user.findUnique({
            where:{
                id: Number(id)
            }
        });

        if (!user){
            return res.status(404).json({
                success: false,
                message: "user not found."
            });
        }
        const applicationCount = await prisma.application.count({
            where: {
                createdById: Number(id)
            }
        });

        if (applicationCount>0) {
            return res.status(400).json({
                success: false,
                messsage: "cannot delete user because they own applications."
            });
        }

        await prisma.user.delete({
            where:{
                id: Number(id)
            }
        });

        return res.status(200).json({
            success: true,
            message: "user deleted successfully."
        });
    


    }catch (error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }

};