const { Contact } = require("../../model/contacts/contact");
const Path = require('path')
const fs = require('fs')
const PdfManager = require('../../middlewares/pdfManager')
const QRCode = require('qrcode');

const getTemplate = template => fs.readFileSync(Path.resolve(__dirname, '../../templates/' + template), 'utf8')
const compileTemplate = function (templateData, variablesData) {
    const Handlebars = require('handlebars')
    return Handlebars.compile(templateData)(variablesData)
  }
const pdf = async (req, res, next) => {
    const id = req.params.contactId;
    const contact = await Contact.findOne({_id: id}).lean();

    const fonts = getTemplate('fonts.css')
    const styles = getTemplate('style.css')
    const layout = getTemplate('layout.html')
    const body = getTemplate('ticket_form.html')

    const template = compileTemplate(layout, {
        content: body,
        styles,
        fonts
    })

    // QRCode.toString('http://www.google.com', {type:'svg'}, function (err, string) {
    //     if (err) throw err
    //     contact.qrCode = string 
    // })
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 0.9,
        margin: 1,
        color: {
          dark:"#000",
          light:"#FFF"
        }
      }
      
      await QRCode.toDataURL(`https://confab-profound.web.app/user/${contact._id}/admin`, opts, async function (err, url) {
        if (err) throw err
      
        contact.qrCode = url
        contact.day = contact.arrivalDay === "Четверг" ? '06.04' : contact.arrivalDay === "Пʼятниця" ? '07.04'  : contact.arrivalDay === "Субота" ? '07.04' : ''
        contact.time = contact.arrivalDay === "Четверг" ? '15:00' : contact.arrivalDay === "Пʼятниця" ? '09:00'  : contact.arrivalDay === "Субота" ? '09:30' : ''
        contact.eatingDays = contact.eatingDays.length===2 ? 'Пт/Сб' : contact.eatingDays.length===1 ? contact.eatingDays[0]  : 'Голодний'
        const html = compileTemplate(template, { user: contact })
    
        const resp = await PdfManager.pdf(html)
        res.setHeader('Content-Length', resp.length);
        res.setHeader('Content-Type', 'application/pdf');
        res.write(resp, 'binary');
        res.end();
    })


};
module.exports = { pdf };
