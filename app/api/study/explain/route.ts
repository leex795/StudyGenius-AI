import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { generateExplanation } from "../../../../lib/ai";
import { enforceDailyLimit } from "../../../../lib/limits";
const schema=z.object({text:z.string().trim().min(3).max(4000)});
export async function POST(req:Request){
 try{
  const user=await requireUser();const body=schema.parse(await req.json());
  await enforceDailyLimit(user.id,"EXPLANATION",body.text.length);
  const result=await generateExplanation(body.text);
  const item=await db.studyItem.create({data:{userId:user.id,type:"EXPLANATION",title:body.text.slice(0,80),sourceText:body.text,resultJson:JSON.stringify(result)}});
  return NextResponse.json({...result,id:item.id});
 }catch(e){const msg=e instanceof Error?e.message:"Request failed.";const status=msg==="UNAUTHORIZED"?401:msg==="DAILY_LIMIT"?429:msg==="NOTE_TOO_LONG"?413:400;return NextResponse.json({error:msg.replace("_"," ")},{status})}
}