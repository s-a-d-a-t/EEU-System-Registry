const Joi = require("joi");

const statusValues = ["DRAFT", "PUBLISHED", "ARCHIVED"];

//create application validation
const createApplicationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(150)
        .required(),

    description: Joi.string()
        .required(),

    version: Joi.string()
        .max(30)
        .required(),

    publishedOn: Joi.date()
        .max("now") // cannot be a future date
        .required(),

    developerName: Joi.string()
        .max(150)
        .required(),

    appUrl: Joi.string()
        .uri() // must be a well-formed URL
        .required(),

    coreFunctionalities: Joi.string()
        .required(),

    frontendStack: Joi.array()
        .items(Joi.string())
        .default([]),

    backendStack: Joi.array()
        .items(Joi.string())
        .default([]),

    iconIndex: Joi.number()
        .integer()
        .min(0)
        .required(),

    theme: Joi.string()
        .required(),

    sortOrder: Joi.number()
        .integer()
        .default(0),

    status: Joi.string()
        .valid(...statusValues)
});

//update application validation
const updateApplicationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(150),

    description: Joi.string(),

    version: Joi.string()
        .max(30),

    publishedOn: Joi.date()
        .max("now"),

    developerName: Joi.string()
        .max(150),

    appUrl: Joi.string()
        .uri(),

    coreFunctionalities: Joi.string(),

    frontendStack: Joi.array()
        .items(Joi.string()),

    backendStack: Joi.array()
        .items(Joi.string()),

    iconIndex: Joi.number()
        .integer()
        .min(0),

    theme: Joi.string(),

    sortOrder: Joi.number()
        .integer(),

    status: Joi.string()
        .valid(...statusValues)
}).min(1); // require at least one field

module.exports = {
    createApplicationSchema,
    updateApplicationSchema
};
