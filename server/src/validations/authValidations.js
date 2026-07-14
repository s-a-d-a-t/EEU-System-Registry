const Joi = require("joi");

//user registration validation
// roleId is intentionally NOT accepted here — public registration always
// creates a VIEWER. Admins set roles through POST /api/users.
const registerSchema = Joi.object({

    fullName: Joi.string()
        .min(3)
        .max(150)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(8)
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
