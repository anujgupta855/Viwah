import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Admin } from "../../../../models";
import { hashPassword, hashResetToken } from "../../../../lib/admin-auth";
export async function POST(request:Request){try{const body=await request.json();const token=String(body.token||"");const password=String(body.password||"");if(!token||password.length<10)return NextResponse.json({error:"Invalid token or password."},{status:400});await connectDB();const admin=await Admin.findOne({resetTokenHash:hashResetToken(token),resetTokenExpiresAt:{$gt:new Date()},active:true});if(!admin)return NextResponse.json({error:"This reset link is invalid or expired."},{status:400});admin.passwordHash=hashPassword(password);admin.resetTokenHash=undefined;admin.resetTokenExpiresAt=undefined;await admin.save();return NextResponse.json({ok:true})}catch(error){console.error(error);return NextResponse.json({error:"Unable to reset password."},{status:500})}}
