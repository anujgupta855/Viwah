import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Enquiry } from "../../../../models";
import { getAdminSession } from "../../../../lib/admin-auth";
export async function GET(){if(!(await getAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});await connectDB();const items=await Enquiry.find().sort({createdAt:-1}).limit(200).populate("vendor","name").populate("venue","name").lean();return NextResponse.json({items});}
