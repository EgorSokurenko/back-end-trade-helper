const { Contact } = require("../../model/contacts/contact");
const getById = async (req, res, next) => {
  const id = req.params.contactId;
  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(404).json({ message: `Not found contact with ID:${id}` });
  }
  res.status(200).json({
    status: "succsess",
    code: 200,
    data: { result: contact },
  });
};
module.exports = { getById };
