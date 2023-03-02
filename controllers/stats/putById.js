const { Contact } = require("../../model/contacts/contact");
const putById = async (req, res, next) => {
  const id = req.params.contactId;
  const updateContact = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updateContact) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({
    status: "succsess",
    code: 200,
    data: { result: updateContact },
  });
};
module.exports = { putById };
