const { Schema, model } = require("mongoose");
const Joi = require("joi");
const contactSchema = Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  city:{
    type: String,
    required: true,
  },
  church:{
    type: String,
    required: true,
  },
  inst:{
    type: String,
  },
  arrivalDay:{
    type: String,
    required: true,
  },
  eatingDays:[String],
  arrived: Boolean,
  createdAt:{type:Date, default: Date.now}
});
const validateSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "org", "net", "ca"] },
    }),
  phone: Joi.string().required(),
  dob: Joi.string().required(),
  city: Joi.string().required(),
  church: Joi.string().required(),
  inst: Joi.string().optional().allow(''),
  arrivalDay: Joi.string().required(),
  eatingDays: Joi.array(),
  arrived: Joi.boolean().optional().allow(null),
});
const Contact = model("contact", contactSchema);
module.exports = { Contact, validateSchema };
