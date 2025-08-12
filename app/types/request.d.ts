import { User } from "@prisma/client";
import { NextRequest } from "next/server";

export interface UNextRequest extends NextRequest {
    user: User | null;
}