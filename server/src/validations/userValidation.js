const Joi = require("joi");

//create user validation (admin action — role is set here)
const createUserSchema = Joi.object({

    fullName: Joi.string()
        .min(3)
        .max(150)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .required(),

    roleId: Joi.number()
        .integer()
        .required()

});

//update user validation
const updateUserSchema = Joi.object({

    fullName: Joi.string()
        .min(3)
        .max(150),

    email: Joi.string()
        .email(),

    roleId: Joi.number()
        .integer(),

    isActive: Joi.boolean()

}).min(1); // require at least one field

module.exports = {
    createUserSchema,
    updateUserSchema
};
