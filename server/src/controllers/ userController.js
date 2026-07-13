const prisma = require("../config/db");

exports.getAllUsers = async (req,res) => {
    try{
        const users = await prisma.user.findMany({
            select: {
                id:true,
                fullName:true,
                email:true,createdAt: true,

                role:{
                    select:{
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return res.status(200).json({
            success:true,
            message:"users retrieved successfully.",
            data: users
        });
    }
        catch(error){
          console.error(error);
          return res.status(500).json({
            success: false,
            message: "Internal server error."
          });
        }
        
};
