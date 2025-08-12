
import { z } from "zod";


const fileSizeLimit = 10 * 1024 * 1024; // 10MB

export const submissionOfPaperSchema = z.object({
    first_name: z
        .string()
        .min(1, {message: "First Name is required"}),
    last_name: z
        .string()
        .min(1, { message: "Last Name is required" }),
    email: z
        .string({ required_error: "Email is required" })
        .email( {message: "Invalid email Address"}),
    university_organization_affiliation: z
        .string()
        .min(1, {message:"Fellowship primary color is required."}),
    department: z
        .string()
        .min(1, {message:"Department is required."}),
    full_paper_title: z
        .string()
        .min(1, {message:"Full paper title is required."}),
    authors: z
        .string()
        .min(1, {message:"Authors are required."}),
    abstract: z
        .string()
        .min(1, {message:"Abstract is required."}),
    keywords: z
        .string().min(1, {message: "Keywords are required."}),
    paper: z
        // .instanceof(File)
        .custom<File>((file) => file instanceof File && file.size > 0, {
            message: "Paper is required",
        })
        .refine(
            (file) =>
                [
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/msword"
                ].includes(file.type),
            { message: "Only .docx and .doc files are allowed." }
        )
        .refine((file) => file.size <= fileSizeLimit, {
            message: "Paper size should not exceed 10MB",
        }),
});

