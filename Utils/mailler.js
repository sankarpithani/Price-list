import nodemailer from "nodemailer";
import fs from 'fs'

export async function sendMail(subject, text) {
const history = fs.existsSync('./Data/priceHistory.json')
? JSON.parse(fs.readFileSync('./Data/priceHistory.json')): []
let cheapestRecord = history[0]
history.forEach(rec => {
    const price = parseFloat(rec.Price.replace(/[^0-9.]/g , ""))
    const chepeastPrice = parseFloat(cheapestRecord.Price.replace(/[^0-9.]/g , ""))
    if(price<chepeastPrice){

        cheapestRecord = rec

    }
});
const chepeast = cheapestRecord.Price
const  cheapDate = cheapestRecord.timestamp
const historyText = history.map((rec,i)=>
    ` ${i+1} | Product name : ${rec.product}  | Price  :  ${rec.Price}  | Date :  ${rec.timestamp}`
).join("\n")
const finalBody = `${text} \n\n Price History :\n${historyText}, \n\n chepest record ${chepeast} on ${cheapDate}`





    let transporter = nodemailer.createTransport({
        service: "gmail", // or SMTP config
        auth: {
            user: "sankarpithani019@gmail.com",
            pass: "vhol ctse qmdz owhi" // Use App Password (not real password)
        }
    });

    
    let info = await transporter.sendMail({
        from: '"Price Tracker" <sankarpithani019@gmail.com>',
        to: "pithani.sai019@gmail.com",
        subject,
        text: finalBody
    });

    console.log("📧 Mail sent:", info.messageId);
}
