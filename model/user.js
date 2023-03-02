const { Schema, model } = require("mongoose");
const Joi = require("joi");
const userSchemma = Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: String,
});
const registerSchema = Joi.object({
  password: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "uk", "org", "net", "ca"] },
    }),
  subscription: Joi.string(),
  token: Joi.boolean(),
});
const subscriptionSchema = Joi.object({
  subscription: Joi.string().required(),
});
const User = model("user", userSchemma);
module.exports = { User, registerSchema, subscriptionSchema };
