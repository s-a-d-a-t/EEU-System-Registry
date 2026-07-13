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

//update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const { fullName, email, roleId } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use."
                });
            }
        }

        if (roleId !== undefined) {
            const role = await prisma.role.findUnique({
                where: {
                    id: Number(roleId)
                }
            });

            if (!role) {
                return res.status(400).json({
                    success: false,
                    message: "Role not found."
                });
            }
        }

        const data = {};

        if (fullName !== undefined) data.fullName = fullName;
        if (email !== undefined) data.email = email;
        if (roleId !== undefined) data.roleId = Number(roleId);

        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data,
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: updatedUser
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

//delete user 
exports.deleteUser = async (req, res) => {
    try {

        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const applicationCount = await prisma.application.count({
            where: {
                createdById: Number(id)
            }
        });

        if (applicationCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete user because they own applications."
            });
        }

        await prisma.user.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};