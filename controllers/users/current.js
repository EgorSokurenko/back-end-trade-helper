const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    code: 200,
    status: "success",
    data: {
      user: {
        email: email,
        subscription: subscription,
      },
    },
  });
};
module.exports = { getCurrent };
