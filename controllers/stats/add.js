const { Contact } = require("../../model/contacts/contact");
const nodemailer = require('nodemailer');
const Path = require('path')
const fs = require('fs')
const getTemplate = template => fs.readFileSync(Path.resolve(__dirname, '../../templates/' + template), 'utf8')
const compileTemplate = function (templateData, variablesData) {
    const Handlebars = require('handlebars')
    return Handlebars.compile(templateData)(variablesData)
  }

const add = async (req, res, next) => {
  const newContact = await Contact.create(req.body);
  const contact = await Contact.findOne({_id: newContact._id}).lean()
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'profoundconf@gmail.com',
      pass: 'vfvneakvapkavhza'
    }
  });

  const fonts = getTemplate('fonts.css')
  const styles = getTemplate('style.css')
  const layout = getTemplate('layout.html')
  const body = getTemplate('email.html')
  const template = compileTemplate(layout, {
    content: body,
    styles,
    fonts
})
  const html = compileTemplate(template, { user: contact })

  var mailOptions = {
    from: 'sokurenko337@gmail.com',
    to: newContact.email,
    subject: 'Profound',
    html: html
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  res.status(201).json({
    status: "succsess",
    code: 200,
    data: newContact ,
  });
};
module.exports = { add };
