import nodemailer, { Transport, Transporter, TransportOptions } from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

// interface mailOptions {
//     from:string,
//     to:string,
//     subject:string,
//     html:string
// }
export const sendMail = async (options:any):Promise<void>=>{
    const transmitter = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:Number(process.env.SMTP_PORT),
        secure:false,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD
        }
    } as {host:string, port:number, secure:boolean , auth:{user:string, pass:string}}) 

    const mailOptions = {
        from:process.env.SMTP_MAIL || '',
        to:options.to || '',
        subject:options.subject || '',
        html:options.html || ''
    } as any

    await transmitter.sendMail(mailOptions)
}

