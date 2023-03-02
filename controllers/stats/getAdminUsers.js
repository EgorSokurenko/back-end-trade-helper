const { Contact } = require("../../model/contacts/contact");
const getAdminUsers = async (req, res, next) => {
    await Contact.findOneAndUpdate({_id: req.params.contactId}, {$set:{arrived:true}});
    const currentContact = await Contact.find({_id: req.params.contactId});
    const result = await Contact.find({_id:{$ne:req.params.contactId}});
    res.status(200).json({
        status: "succsess",
        code: 200,
        data: { users: result, currentUser: currentContact[0] },
    });
};
module.exports = { getAdminUsers };
