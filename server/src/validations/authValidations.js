const Joi = require("joi");

//user registration validation
const registrationSchema = Joi.object({

    fullName: Joi.string()
        .min(3)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(6)
        .required(),
    roleId: Joi.number()
        .required()

});

//user login validation

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()

});

module.exports = {
    registerSchema,
    loginSchema
};