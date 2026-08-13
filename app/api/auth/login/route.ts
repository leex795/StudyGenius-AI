import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../../lib/db";
import { createSession, verifyPassword } from "../../../../lib/auth";

const schema=z.object({email:z.string().email(),password:z.string().min(1)});
export async function POST(req:Request){
 try{
   const body=schema.parse(await req.json());
   const user=await db.user.findUnique({where:{email:body.email.toLowerCase().trim()}});
   if(!user || !(await verifyPassword(body.password,user.passwordHash))) return NextResponse.json({error:"Email or password is incorrect."},{status:401});
   await createSession(user.id); return NextResponse.json({ok:true});
 }catch(e){return NextResponse.json({error:"Invalid sign-in request."},{status:400})}
}