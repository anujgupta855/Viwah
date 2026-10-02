import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { Vendor } from "../../../../models";
import { getAdminSession } from "../../../../lib/admin-auth";
import { z } from "zod";
const escapeRegex=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const schema = z.object({ name:z.string().min(2), category:z.enum(["Photographer","Makeup Artist","Decorator","Caterer","Mehendi Artist","DJ"]), city:z.string().min(2), description:z.string().min(10), profileImage:z.string().url(), portfolioImages:z.array(z.string().url()).default([]),youtubeVideos: z
  .array(
    z.object({
      title: z.string().min(1),
      url: z.string().url(),
    }),
  )
  .default([]), startingPrice:z.coerce.number().min(0), pricingUnit:z.enum(["package","per_plate"]).default("package"), packages:z.array(z.object({name:z.string(),price:z.coerce.number().min(0),description:z.string()})).default([]), rating:z.coerce.number().min(0).max(5).default(0), reviewCount:z.coerce.number().min(0).default(0), phone:z.string().min(5), email:z.string().email(), address:z.string().min(2), featured:z.boolean().default(false), status:z.enum(["active","inactive"]).default("active") });
const slugify=(s:string)=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
export async function GET(request: Request) { if (!(await getAdminSession())) return NextResponse.json({error:"Unauthorized"},{status:401}); await connectDB(); const {searchParams}=new URL(request.url); const q=searchParams.get("q")||""; const category=searchParams.get("category")||""; const city=searchParams.get("city")||""; const status=searchParams.get("status")||""; const page=Math.max(1,Number(searchParams.get("page")||1)); const limit=10; const filter:any={}; if(q) filter.$or=[{name:new RegExp(escapeRegex(q),"i")},{city:new RegExp(escapeRegex(q),"i")}]; if(category) filter.category=category; if(city) filter.city=city; if(status) filter.status=status; const [items,total]=await Promise.all([Vendor.find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean(),Vendor.countDocuments(filter)]); return NextResponse.json({items,total,page,pages:Math.ceil(total/limit)}); }
export async function POST(request:Request){if(!(await getAdminSession()))return NextResponse.json({error:"Unauthorized"},{status:401}); try{const data=schema.parse(await request.json()); await connectDB(); const base=slugify(data.name); let slug=base; let i=1; while(await Vendor.exists({slug})) slug=`${base}-${i++}`; const item=await Vendor.create({...data,slug}); return NextResponse.json({item},{status:201});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Invalid vendor data"},{status:400});}}
