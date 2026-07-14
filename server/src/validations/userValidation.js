const Joi = require ("joi");

//update user validation
const updateUserSchema = Joi.object({

    fullName: Joi.string()
        .min(3),

    email: Joi.string()
        .email(),

    roleId: Joi.number()

}).min(1);// makes user to send atleast one field 

