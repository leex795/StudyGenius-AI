(()=>{var a={};a.id=7,a.ids=[7],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2921:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>H,patchFetch:()=>G,routeModule:()=>C,serverHooks:()=>F,workAsyncStorage:()=>D,workUnitAsyncStorage:()=>E});var d={};c.r(d),c.d(d,{POST:()=>B});var e=c(5736),f=c(9117),g=c(4044),h=c(9326),i=c(2324),j=c(261),k=c(4290),l=c(5328),m=c(8928),n=c(6595),o=c(3421),p=c(7679),q=c(1681),r=c(3446),s=c(6439),t=c(1356),u=c(641),v=c(5711),w=c(6147),x=c(7143),y=c(9443),z=c(5057);let A=v.Ik({text:v.Yj().trim().min(20).max(12e4),count:v.ai().int().min(10).max(40)});async function B(a){try{let b=await (0,w.JR)(),c=A.parse(await a.json());await (0,z.R)(b.id,"FLASHCARDS",c.text.length);let d=await (0,y.Rd)(c.text,c.count),e=await x.db.studyItem.create({data:{userId:b.id,type:"FLASHCARDS",title:`${c.count} flashcards`,sourceText:c.text,resultJson:JSON.stringify(d)}});return u.NextResponse.json({...d,id:e.id})}catch(c){let a=c instanceof Error?c.message:"Request failed.",b="UNAUTHORIZED"===a?401:"DAILY_LIMIT"===a?429:"NOTE_TOO_LONG"===a?413:400;return u.NextResponse.json({error:a.replace("_"," ")},{status:b})}}let C=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/study/flashcards/route",pathname:"/api/study/flashcards",filename:"route",bundlePath:"app/api/study/flashcards/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/data/data/com.termux/files/home/StudyGenius_AI_Production_complete/app/api/study/flashcards/route.ts",nextConfigOutput:"",userland:d}),{workAsyncStorage:D,workUnitAsyncStorage:E,serverHooks:F}=C;function G(){return(0,g.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:E})}async function H(a,b,c){var d;let e="/api/study/flashcards/route";"/index"===e&&(e="/");let g=await C.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||C.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===C.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>C.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>C.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await C.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await C.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await C.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5057:(a,b,c)=>{"use strict";c.d(b,{R:()=>e});var d=c(7143);async function e(a,b,c){let e=new Date;if(e.setHours(0,0,0,0),((await d.db.usageEvent.aggregate({_sum:{chars:!0},where:{userId:a,createdAt:{gte:e}}}))._sum.chars??0)+c>25e4)throw Error("DAILY_LIMIT");await d.db.usageEvent.create({data:{userId:a,type:b,chars:c}})}},5511:a=>{"use strict";a.exports=require("crypto")},6147:(a,b,c)=>{"use strict";c.d(b,{BE:()=>l,Er:()=>k,HW:()=>o,JR:()=>p,jw:()=>m,q7:()=>n});var d=c(5511),e=c.n(d),f=c(4647),g=c(6802),h=c(7143);let i="studygenuis_session";function j(a){return e().createHmac("sha256",function(){let a=process.env.SESSION_SECRET;if(!a)throw Error("SESSION_SECRET is missing");return a}()).update(a).digest("hex")}async function k(a){return f.Ay.hash(a,12)}async function l(a,b){return f.Ay.compare(a,b)}async function m(a){let b=e().randomBytes(32).toString("hex"),c=j(b),d=new Date(Date.now()+2592e6);await h.db.session.create({data:{userId:a,tokenHash:c,expiresAt:d}}),(await (0,g.UL)()).set(i,b,{httpOnly:!0,secure:!0,sameSite:"lax",path:"/",expires:d})}async function n(){let a=await (0,g.UL)(),b=a.get(i)?.value;b&&await h.db.session.deleteMany({where:{tokenHash:j(b)}}),a.delete(i)}async function o(){let a=await (0,g.UL)(),b=a.get(i)?.value;if(!b)return null;let c=await h.db.session.findUnique({where:{tokenHash:j(b)},include:{user:!0}});return c?c.expiresAt<new Date?(await h.db.session.delete({where:{id:c.id}}),a.delete(i),null):c.user:null}async function p(){let a=await o();if(!a)throw Error("UNAUTHORIZED");return a}},6330:a=>{"use strict";a.exports=require("@prisma/client")},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},7143:(a,b,c)=>{"use strict";c.d(b,{db:()=>e});var d=c(6330);let e=globalThis.prisma??new d.PrismaClient({log:["error"]})},8335:()=>{},9121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9443:(a,b,c)=>{"use strict";c.d(b,{Rd:()=>k,hy:()=>m,ur:()=>l});var d=c(8676),e=c(5711);let f=e.Ik({cards:e.YO(e.Ik({question:e.Yj().min(1),answer:e.Yj().min(1),explanation:e.Yj().optional().default("")})).min(1)}),g=e.Ik({title:e.Yj().min(1),summary:e.Yj().min(1),key_points:e.YO(e.Yj()).default([]),terms:e.YO(e.Yj()).default([])}),h=e.Ik({simple:e.Yj().min(1),analogy:e.Yj().optional().default(""),example:e.Yj().optional().default(""),remember:e.Yj().optional().default("")}),i=`
You are StudyGenius AI, an expert educational tutor.

Your job is to help students understand and remember their study material.

IMPORTANT RULES:
- Use the supplied material as the primary source.
- Never invent facts that are not supported by the material.
- Do not remove important scientific, mathematical, historical, or technical meaning merely to make something shorter.
- Use clear student-friendly language.
- Prefer active recall and understanding over copying sentences.
- Avoid duplicate information.
- If the material contains formulas, definitions, processes, comparisons, causes, effects, examples, or important facts, preserve them when relevant.
`;function j(a){let b=a.replace(/\u0000/g,"").trim();if(b.length<3)throw Error("INPUT_TOO_SHORT");if(b.length>12e4)throw Error("NOTE_TOO_LONG");return b}async function k(a,b){let c=j(a);if(!Number.isInteger(b)||b<10||b>40)throw Error("INVALID_CARD_COUNT");let d=`
${i}

Create exactly ${b} high-quality flashcards from the study material.

FLASHCARD QUALITY:
- Cover different parts of the material.
- Do not make several cards ask essentially the same question.
- Prioritize important concepts over tiny unimportant details.
- Include definitions, facts, processes, steps, causes/effects, comparisons, formulas and examples when present.
- Make questions stand alone so a student can understand them without seeing the original notes.
- Keep answers concise but complete.
- Add a short explanation when it helps understanding.
- Do not create information that is absent from the source.

Return ONLY valid JSON in exactly this shape:

{
  "cards": [
    {
      "question": "Question",
      "answer": "Answer",
      "explanation": "Short explanation"
    }
  ]
}
`,e=await n(d,c),g=f.parse(e);if(g.cards.length!==b)throw Error("AI_RETURNED_WRONG_CARD_COUNT");return g}async function l(a,b){let c=j(a),d={quick:`
Make this a QUICK revision summary.
Focus only on the most important ideas.
Keep it compact and easy to scan.
`,medium:`
Make this a MEDIUM study summary.
Cover the major concepts and important supporting details.
It should be useful for normal revision without becoming unnecessarily long.
`,detailed:`
Make this a DETAILED study summary.
Cover the important concepts, definitions, relationships, processes,
examples and supporting details needed for strong understanding.
Do not simply copy the source.
`},e=`
${i}

${d[b]}

Organize the result for studying.

The summary should:
- explain ideas clearly
- remove repetition and filler
- preserve important relationships
- use simple language where possible
- identify important terms and their meanings
- remain faithful to the supplied material

Return ONLY valid JSON in exactly this shape:

{
  "title": "Useful study title",
  "summary": "Study-friendly summary",
  "key_points": [
    "Important point",
    "Important point"
  ],
  "terms": [
    "term — simple meaning"
  ]
}
`;return g.parse(await n(e,c))}async function m(a){let b=j(a);if(b.length>4e3)throw Error("EXPLANATION_TOO_LONG");let c=`
${i}

Explain the student's topic to someone who knows almost nothing about it.

Use the following teaching method:

1. SIMPLE:
Explain the idea using very easy words.
Imagine you are teaching a young beginner.
Do NOT use unnecessary jargon.

2. ANALOGY:
Give a familiar everyday comparison that makes the idea easier to picture.
Make sure the analogy does not introduce an incorrect scientific or factual idea.

3. EXAMPLE:
Give one concrete example.

4. REMEMBER:
Give one short memorable sentence the student can use to recall the main idea.

IMPORTANT:
- "Simple" must still be accurate.
- If a technical term is necessary, define it immediately.
- Break complicated processes into small steps.
- Do not talk down to the student.
- Do not invent information.

Return ONLY valid JSON in exactly this shape:

{
  "simple": "Very easy explanation",
  "analogy": "Familiar analogy",
  "example": "Concrete example",
  "remember": "One memorable sentence"
}
`;return h.parse(await n(c,b))}async function n(a,b){let c=function(){let a=process.env.OPENAI_API_KEY?.trim();if(!a)throw Error("AI_NOT_CONFIGURED");return new d.Ay({apiKey:a,timeout:6e4,maxRetries:2})}();try{let d=await c.responses.create({model:process.env.OPENAI_MODEL||"gpt-5",instructions:a,input:b,text:{format:{type:"json_object"}},store:!1});if(!d.output_text?.trim())throw Error("AI_EMPTY_RESPONSE");return JSON.parse(d.output_text)}catch(a){if(a instanceof SyntaxError)throw Error("AI_INVALID_RESPONSE");if(a instanceof Error&&("AI_NOT_CONFIGURED"===a.message||"AI_EMPTY_RESPONSE"===a.message))throw a;throw Error("AI_REQUEST_FAILED")}}}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[331,889,692,711,676],()=>b(b.s=2921));module.exports=c})();