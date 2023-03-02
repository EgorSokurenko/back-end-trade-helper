const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const { User } = require("../../model/user");
const { Conflict } = require("http-errors");
const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`User with ${email} already created`);
  }
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const avatarURL = gravatar.url(email);
  await User.create({ email, avatarURL, password: hashPassword });
  res.status(201).json({
    code: 201,
    data: {
      user: {
        email,
        avatarURL,
        subscription: "starter",
      },
    },
  });
};
module.exports = { signup };
