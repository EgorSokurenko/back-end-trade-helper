const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../model/user");
const { Unauthorized } = require("http-errors");
const { SECRET_KEY } = process.env;
const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Unauthorized("Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY);
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    code: 200,
    status: "succsess",
    data: {
      token: token,
      user: {
        email: email,
        subscription: "starter",
      },
    },
  });
};
module.exports = { signin };
