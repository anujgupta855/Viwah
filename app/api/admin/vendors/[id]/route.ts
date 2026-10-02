import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { Vendor } from "../../../../../models";
import { getAdminSession } from "../../../../../lib/admin-auth";
import { z } from "zod";
const schema=z.object({name:z.string().min(2),category:z.enum(["Photographer","Makeup Artist","Decorator","Caterer","Mehendi Artist","DJ"]),city:z.string().min(2),description:z.string().min(10),profileImage:z.string().url(),portfolioImages:z.array(z.string().url()),
   youtubeVideos: z.array(
  z.object({
    title: z.string().min(1),
    url: z.string().url(),
  }),
).default([]),
startingPrice:z.coerce.number().min(0),pricingUnit:z.enum(["package","per_plate"]),packages:z.array(z.object({name:z.string(),price:z.coerce.number().min(0),description:z.string()})),rating:z.coerce.number().min(0).max(5),reviewCount:z.coerce.number().min(0),phone:z.string().min(5),email:z.string().email(),address:z.string().min(2),featured:z.boolean(),status:z.enum(["active","inactive"])});
const slugify=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){if(!(await getAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});await connectDB();const {id}=await params;const item=await Vendor.findById(id).lean();if(!item)return NextResponse.json({error:"Not found"},{status:404});return NextResponse.json({item});}
export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){if(!(await getAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});try{await connectDB();const {id}=await params;const data=schema.parse(await request.json());const existing=await Vendor.findById(id);if(!existing)return NextResponse.json({error:"Not found"},{status:404});let slug=slugify(data.name);const conflict=await Vendor.findOne({slug,_id:{$ne:id}});if(conflict)slug=`${slug}-${String(id).slice(-5)}`;const item=await Vendor.findByIdAndUpdate(id,{...data,slug},{new:true,runValidators:true}).lean();return NextResponse.json({item});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Invalid vendor data"},{status:400});}}
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){if(!(await getAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401});await connectDB();const {id}=await params;const item=await Vendor.findByIdAndDelete(id);if(!item)return NextResponse.json({error:"Not found"},{status:404});return NextResponse.json({ok:true});}
