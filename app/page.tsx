"use client"

import React, { useState } from 'react'
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { ZodIssue } from "zod";
import { Formik } from "formik";
import { Utility } from './classes/ClientUtility';
import { Textarea } from './components/ui/textarea';
import { sendMail } from './lib/sendEmail';
import { Montserrat } from "next/font/google"
import { submissionOfPaperSchema } from './api/schemaDefinitions/paper-submission';
import Script from 'next/script';

const montserrat = Montserrat({
    subsets: ['latin']
});

export type State = {
  errors?: ZodIssue[];
  error?: boolean;
  message?: string;
  status?: number;
};

const FellowshipForm = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    
    const initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        university_organization_affiliation: "",
        department: "",
        full_paper_title: "",
        authors: "",
        abstract: "",
        keywords: "",
        additional_information: "",
        paper: null,
    }

    const submit = async(fellowshipData: SubmissionPaperType) => {
      try{
        setIsSubmitting(true);

        // Upload files to the server
        const { paper, ...otherFields } = fellowshipData;
        let document = null;

        let paperURL = "";
        
        if(paper instanceof File){
            try{
                let { file } = await Utility.uploadFilesToServer(paper);
                paperURL = file?.src;
            }catch(err){
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
        console.log(generateEmailTemplate);

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

        setFormSubmitted(true);
      }catch(error:any){
          console.error(error.message);
      }finally{
          setIsSubmitting(false);
      }
    }
    
  return (
    formSubmitted ? (
        <div className="max-w-3xl mx-auto space-y-8 p-6 bg-white shadow-md rounded-xl" style={montserrat.style}>
            <h2 className="text-2xl font-bold">Paper submitted successfully</h2>
            <button className='cursor-pointer underline text-blue-600' onClick={() => setFormSubmitted(false)}>Submit another paper</button>
        </div>
    ) : (
        <Formik
            initialValues={initialValues}
            validate={async (values) => {
                const validateFn = await Utility.zodValidate(submissionOfPaperSchema);
                return validateFn(values);
            }}
            onSubmit={async (values) => {
                try{
                    await submit(values);
                }catch(error){
                    console.log({error});
                }
            }}
        >
            {
                ({ values, errors, touched, setFieldValue, validateForm, setTouched, handleBlur, handleChange, handleSubmit }) => (
                    <form method="POST" onSubmit={handleSubmit} style={montserrat.style} className="my-4 max-w-3xl mx-auto space-y-8 p-6 bg-white shadow-md rounded-xl">
                        <div className="space-y-4">
                            <img src="/OAU-logo.png" className='mx-auto w-56' alt="" />
                            <h2 className="text-2xl font-bold text-center">IFE Journal of Information and Communication Technology</h2>
                            <p className='text-2xl font-medium text-center underline'>Call for Papers</p>
                            <div>
                                <Label htmlFor="first_name" className="py-2">First Name<span className='text-red-500'>*</span></Label>
                                <Input 
                                    id="first_name" 
                                    name="first_name" 
                                    value={values?.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {touched?.first_name && errors?.first_name && <div className='error-feedback'>{errors?.first_name}</div>}
                            </div>
                            <div>
                                <Label htmlFor="last_name" className="py-2">Last Name<span className='text-red-500'>*</span></Label>
                                <Input 
                                    id="last_name" 
                                    name="last_name" 
                                    value={values?.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {touched?.last_name && errors?.last_name && <div className='error-feedback'>{errors?.last_name}</div>}
                            </div>
                            <div>
                                <Label htmlFor="email" className="py-2">Email<span className='text-red-500'>*</span></Label>
                                <Input 
                                    id="email" 
                                    name="email"
                                    value={values?.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required 
                                />
                                {touched?.email && errors?.email && <div className='error-feedback'>{errors?.email}</div>}
                            </div>
                            <div>
                                <Label htmlFor="phone_number" className="py-2">Phone Number</Label>
                                <Input 
                                    id="phone_number" 
                                    name="phone_number" 
                                    value={values?.phone_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required 
                                />
                            </div>
                            <div>
                                <Label htmlFor="university_organization_affiliation" className="py-2">University/Organization/Affiliation<span className='text-red-500'>*</span></Label>
                                <Input 
                                    id="university_organization_affiliation" 
                                    name="university_organization_affiliation" 
                                    value={values?.university_organization_affiliation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {touched?.university_organization_affiliation && errors?.university_organization_affiliation && <div className='error-feedback'>{errors?.university_organization_affiliation}</div>}
                            </div>
                            
                            <div>
                                <Label htmlFor="department" className="py-2">Department<span className='text-red-500'>*</span></Label>
                                <Input 
                                    id="department" 
                                    name="department" 
                                    value={values?.department}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required 
                                />
                                {touched?.department && errors?.department && <div className='error-feedback'>{errors?.department}</div>}
                            </div> 
    
                            <div>
                                <Label htmlFor="full_paper_title" className="py-2">Full Paper Title<span className='text-red-500'>*</span> </Label>
                                <Input 
                                    id="full_paper_title" 
                                    name="full_paper_title" 
                                    value={values?.full_paper_title}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required 
                                />
                                {touched?.full_paper_title && errors?.full_paper_title && <div className='error-feedback'>{errors?.full_paper_title}</div>}
                            </div> 
    
                            <div>
                                <Label htmlFor="authors" className="py-2">All Authors<span className='text-red-500'>*</span> </Label>
                                <span className='text-sm'>Please include Full name, Affiliation and email. Example: John Doe, Dept. of Software Engineering, OAU, Ile-ife., (johndoe@ijict.com)</span>
                                <Textarea
                                    id="authors" 
                                    name="authors"
                                    value={values?.authors}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className="h-[150px]"
                                >
                                </Textarea>
                                {touched?.authors && errors?.authors && <div className='error-feedback'>{errors?.authors}</div>}
                            </div> 
    
                            <div>
                                <Label htmlFor="abstract" className="py-2">Abstract<span className='text-red-500'>*</span> </Label>
                                <Input 
                                    id="abstract" 
                                    name="abstract" 
                                    value={values?.abstract}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required 
                                />
                                {touched?.abstract && errors?.abstract && <div className='error-feedback'>{errors?.abstract}</div>}
                            </div>
    
                            <div>
                                <Label htmlFor="keywords" className="py-2">Keywords<span className='text-red-500'>*</span> </Label>
                                <span className='text-sm'>Between 4 to 6 keywords</span>
                                <Input 
                                    id="keywords" 
                                    name="keywords" 
                                    value={values?.keywords}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required 
                                />
                                {touched?.keywords && errors?.keywords && <div className='error-feedback'>{errors?.keywords}</div>}
                            </div>
    
                            <div>
                                <Label htmlFor="paper" className="capitalize py-2">Paper<span className='text-red-500'>*</span></Label>
                                <Input 
                                    type="file" 
                                    name="paper" 
                                    id="paper" 
                                    required 
                                    onChange={(e) => {
                                        const file = e.currentTarget.files?.[0] || [];
                                        setFieldValue("paper", file);
                                    }}
                                    accept='.docx, .doc'
                                />
                                {touched?.paper && errors?.paper && <div className='error-feedback'>{errors?.paper}</div>}
                            </div>
                        </div>
                        <input id="form_botcheck" name="form_botcheck"type="hidden" value="" />
                        <button 
                          type="submit" 
                          data-sitekey="6LdaNSQpAAAAAAODPgR3XroopgEJ1gyLUac8yv51" 
                          data-callback='onSubmit' 
                          disabled={isSubmitting} 
                          style={{background:"black"}} 
                          data-action='submit' 
                          data-loading-text="Please wait..."
                          className="g-recaptcha cursor-pointer bg-black text-white px-4 py-2 rounded"
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                )
            }
        </Formik>
    )
    
  )
}

export default FellowshipForm;