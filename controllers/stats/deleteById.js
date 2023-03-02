const { Contact } = require("../../model/contacts/contact");
const deleteById = async (req, res, next) => {
  const id = req.params.contactId;
  const deleteContact = await Contact.findByIdAndRemove(id);
  if (deleteContact === null) {
    res.status(404).json({ message: `Not found contact with ID:${id}` });
  }
  res.status(200).json({ message: "contact deleted" });
};
module.exports = { deleteById };
