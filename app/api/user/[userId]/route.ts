import { NextRequest, NextResponse } from "next/server";

const user = async(req: NextRequest, {params} : { params: { userId: string } }) => {
    try{
        const {userId} = params;
        
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "An error occurred while fetching the user."}, {status: 500});
    }
}

export {user as GET}