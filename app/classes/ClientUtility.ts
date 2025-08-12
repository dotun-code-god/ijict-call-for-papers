import { z } from "zod";
import axiosFetch from "@/config/axios";

export class Utility {
    public static async zodValidate(schema: z.ZodSchema<any>){
        return (values: any) => {
            const result = schema.safeParse(values);
            if (!result.success) {
                const errors: Record<string, string> = {};
                result.error.errors.forEach((e) => {
                    if (e.path.length > 0) {
                    errors[e.path[0] as string] = e.message;
                    }
                });
                return errors;
            }
        };
    }

    public static async uploadFilesToServer(paperFile: File) : Promise<{file: UploadedFile, message: string}> {
        const fd = new FormData();
        fd.append(`paper`, paperFile)
        const {data} = await axiosFetch.post(
            "api/upload-file",
            fd,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              },
            timeout: 30000
            }
        );
        return data as {file: UploadedFile, message: string};
    }
}

