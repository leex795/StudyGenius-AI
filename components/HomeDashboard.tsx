"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Item={id:string,type:string,title:string,createdAt:string};

export function HomeDashboard({name}:{name:string}){
  const [history,setHistory]=useState<Item[]>([]);
  const [online,setOnline]=useState(true);
  useEffect(()=>{setOnline(navigator.onLine); const on=()=>setOnline(true),off=()=>setOnline(false); addEventListener("online",on);addEventListener("offline",off); fetch("/api/history").then(r=>r.ok?r.json():null).then(d=>d&&setHistory(d.items||[])); return()=>{removeEventListener("online",on);removeEventListener("offline",off)}},[]);
  return <main className="container">
    {!online && <div className="panel" style={{marginBottom:12,color:"#ffcf8a"}}>You are offline. Your current screen is still available, but AI generation needs a connection.</div>}
    <section className="hero"><div className="eyebrow">YOUR AI STUDY TOOLKIT</div><h1>Study less confused.<br/><span>Understand more.</span></h1><p>Hi {name || "there"} — turn your notes into useful revision material.</p></section>
    <div className="tool-grid">
      <Link href="/app/flashcards" className="tool-card"><div className="tool-icon">📚</div><div className="tool-copy"><b>Make Flashcards</b><span>Create high-value question-and-answer cards from your material.</span></div><span className="chevron">›</span></Link>
      <Link href="/app/summary" className="tool-card"><div className="tool-icon">📝</div><div className="tool-copy"><b>Effective Summary</b><span>Reduce long notes while keeping the important ideas.</span></div><span className="chevron">›</span></Link>
      <Link href="/app/explain" className="tool-card"><div className="tool-icon">👶</div><div className="tool-copy"><b>Explain Simply</b><span>Break hard topics down with simple language and examples.</span></div><span className="chevron">›</span></Link>
    </div>
    <div style={{marginTop:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}><b>Recent study</b><span style={{fontSize:11,color:"var(--muted)"}}>{history.length} saved</span></div>
      <div className="panel">
        {history.length===0 ? <div className="empty">Your generated study material will appear here.</div> :
          history.slice(0,6).map(i=><Link key={i.id} href={i.type==="FLASHCARDS"?"/app/flashcards":i.type==="SUMMARY"?"/app/summary":"/app/explain"} style={{display:"block",padding:"10px 0",borderBottom:"1px solid var(--line)",color:"var(--text)",textDecoration:"none"}}><span style={{fontSize:11,color:"var(--green)"}}>{i.type}</span><br/><span style={{fontSize:13}}>{i.title}</span></Link>)
        }
      </div>
    </div>
  </main>
}
