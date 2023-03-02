const { User } = require("../../model/user");
const patchSub = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  //   почему-то не работает проверка по 3 подписках
  await User.findByIdAndUpdate(_id, {
    subscription,
  });
  res.status(201).json({
    message: "Subscription update",
  });
};
module.exports = { patchSub };
