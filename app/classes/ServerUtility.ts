import cloudinary from "@/lib/cloudinary";
import path from "path";
import os from "os";
import cuid from "cuid";
import fs from "fs/promises";

export class Utility {
    public static async uploadFile(file: File, maxSize: number = 5 * 1024 * 1024) {
        const size = file?.size; // mb;

        if (size == 0 || size >= maxSize) {
            return {
                size,
                src: null,
            };
        }
        
        try{
            const image = await file.arrayBuffer();
            const mimeType = file.type;
            const extension = path.extname(file?.name).slice(1);
            const location = path.join(os.tmpdir());
            const file_name = `${Date.now()}-${cuid()}.${extension}`;
            const buffer = Buffer.from(image);
    
            const src = path.join(location, file_name);
            await fs.writeFile(src, buffer);
    
            const upload = await cloudinary.uploader.upload(src);
    
            await fs.rm(src);
    
            return {
                src: upload.secure_url,
                size,
                provider: "cloudinary",
            };
        }catch(error: any){
            console.log({error});
            throw new Error("Cloudinary Upload Failed.");
        }
    }
}