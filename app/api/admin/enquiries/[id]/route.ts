import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Enquiry } from "../../../../../models";
import { getAdminSession } from "../../../../../lib/admin-auth";
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){if(!(await getAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});const {status}=await request.json();if(!["new","read","contacted","closed"].includes(status))return NextResponse.json({error:"Invalid status"},{status:400});await connectDB();const item=await Enquiry.findByIdAndUpdate((await params).id,{status},{new:true}).lean();if(!item)return NextResponse.json({error:"Not found"},{status:404});return NextResponse.json({item});}
