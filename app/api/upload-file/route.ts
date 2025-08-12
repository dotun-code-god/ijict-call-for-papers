import { Utility } from "@/classes/ServerUtility";
import { NextRequest, NextResponse } from "next/server";

const UploadFileWithoutAuth = async(req: NextRequest) => {
    try{

        const fd = await req.formData();
        const paper = fd.get("paper") as File;

        const fileUploaded = await Utility.uploadFile(paper);

        return NextResponse.json({ message: "Files Uploaded Successfully.", file: fileUploaded }, { status: 200 })
        
    }catch(err:any){
        console.log({err});
        return NextResponse.json({msg: "Internal Server Error"}, {status: 400});
    }
}

export { UploadFileWithoutAuth as POST };