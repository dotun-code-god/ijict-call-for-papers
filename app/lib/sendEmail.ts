"use server"

import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

// const SMTP_SERVER_HOST = process.env


const options: SMTPTransport.Options = {
    host: process.env.SMTP_SERVER,
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass:  process.env.SMTP_PASSWORD
    }
};
  
const transporter = nodemailer.createTransport(options);

export async function sendMail( emailParams: { from:string,  sendTo: string, subject:string, html: string}) {
    try{
        const isVerified = await transporter.verify();
        const info = await transporter.sendMail({
            from:emailParams.from,
            to: emailParams.sendTo,
            subject: emailParams.subject,
            html: emailParams.html

        });
        console.log("Invitation Sent!");
        return true;
    } catch(err) {
        console.error("Something went wrong", err);
        return;
    }

}

