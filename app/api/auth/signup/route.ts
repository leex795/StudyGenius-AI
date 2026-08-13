import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../../lib/db";
import { createSession, hashPassword } from "../../../../lib/auth";

const schema=z.object({name:z.string().trim().max(60).optional(),email:z.string().email(),password:z.string().min(8).max(100)});
export async function POST(req:Request){
  try{
    const body=schema.parse(await req.json());
    const email=body.email.toLowerCase().trim();
    const exists=await db.user.findUnique({where:{email}});
    if(exists)return NextResponse.json({error:"An account with that email already exists."},{status:409});
    const user=await db.user.create({data:{email,name:body.name,passwordHash:await hashPassword(body.password)}});
    await createSession(user.id);
    return NextResponse.json({ok:true});
  }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Invalid request."},{status:400})}
}