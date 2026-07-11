const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../db");

exports.register = async (req,res) => {
    try{
        const {
            username,
            email,
            password,
            roleId
        } = req.body;
    }

    catch (error)
    {
      res.status(500).json({
        message:"server error"

      });
    }


//checking for existing user
const existingUser = await prisma.user.findUnique({
        where:{
            email:email
        }
});

if (existingUser){
    return res.status(400).json({
        message:"Email already exists"
    });
}

//hashing the password
const hashedPassword = await bcrypt.hash(password,10);

//create user
const user = await prisma.user.create({
    data:{
        username,
        email,
        password:hashedPassword,
        roleId
    }
});
res.status(201).json({

    message:"User created successfully",

    user:{
        id:user.id,
        username:user.username,
        email:user.email
    }

});


};