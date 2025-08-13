"use server"

import { Utility } from "@/classes/ServerUtility";
import { sendMail } from "@/lib/sendEmail";
import { verifyCaptchaToken } from "@/lib/verify-captcha";

export async function submitPaper(token: string | null, data: SubmissionPaperType) {
    if(!token){
        return {
            success: false,
            message: "Token not found"
        }
    }

    // verify token
    const captchaData = await verifyCaptchaToken(token);

    if(!captchaData){
        return {
            success: false,
            message: "Captcha Failed"
        }
    }

    if(!captchaData.success || captchaData.score < 0.5){
        return {
            success: false,
            message: "Captcha Failed",
            errors: !captchaData.success ? captchaData["error-codes"] : undefined
        }
    }
    
    // Upload files to the server
    const { paper, ...otherFields } = data;
    let document = null;

    let paperURL = "";
    
    if(paper instanceof File){
        try{
            const file = await Utility.uploadFile(paper);
            if(!file.src){
                throw new Error("File not uploaded");
            }
            paperURL = file?.src;
        }catch(err){
            console.log({err});
            throw new Error("File Upload Failed");
        }
    }else{
        throw new Error("Ensure you upload the necessary files to continue.");
    }
    
    const generateEmailTemplate = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Below is the submission details for this paper</h2> <br />

            <p>First Name: ${otherFields.first_name}</p>
            <p>Last Name: ${otherFields.last_name}</p>
            <p>Email: ${otherFields.email}</p>
            <p>Phone Number: ${otherFields?.phone_number}</p>
            <p>University/Organization/Affiliation: ${otherFields?.university_organization_affiliation}</p>
            <p>Department: ${otherFields?.department}</p>
            <p>Full Paper Title: ${otherFields?.full_paper_title}</p>
            <p>All Authors: ${otherFields?.authors}</p>
            <p>Abstract of Paper: ${otherFields?.abstract}</p>
            <p>Keywords: ${otherFields?.keywords}</p>
            <p>Additional Information: ${otherFields?.additional_information}</p>
            <p>Attached Full Paper: <a href="${paperURL}">${paperURL}</a></p>
        </div>
    `;

    const emailParams1 = {
        from: process.env.FELLOWHUB_EMAIL as string,
        sendTo: "ijict.oauife@gmail.com",
        subject: `Paper Submission for IJICT`,
        html: generateEmailTemplate
    }

    const emailParams2 = {
        from: process.env.FELLOWHUB_EMAIL as string,
        sendTo: "ijict@oauife.edu.ng",
        subject: `Paper Submission for IJICT`,
        html: generateEmailTemplate
    }
    await sendMail(emailParams1);
    await sendMail(emailParams2);

    return {
        success: true,
        message: "Paper submitted successfully."
    }
}