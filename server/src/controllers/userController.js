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

//getting user by id

exports.getUserById = async (req,res) => {
   try{
      const {id} = req.params;

      const user = await prisma.user.findUnique({

        where: {
            id: Number(id)
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            createdAt: true,

            role:{
                select:{
                    id:true,
                    name:true
                }
            }
        }
      });

      if (!user){
        return res.status(404).json({
            success: false,
            message: "user not found."
        });
      }

      return res.status(200).json({
        success: true,
        message: "user retrieved successfully.",
        data: user
      });
   } catch(error){
    console.error(error);

    return res.status(500).json({
        message:"internal server error."
    });
   }

};
