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
                    message: "Access denoed."
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