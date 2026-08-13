"use client";
import { useState } from "react";

type Mode="flashcards"|"summary"|"explain";

export function StudyTool({mode}:{mode:Mode}){
  const [text,setText]=useState("");
  const [count,setCount]=useState(20);
  const [size,setSize]=useState<"quick"|"medium"|"detailed">("medium");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [result,setResult]=useState<any>(null);
  const [index,setIndex]=useState(0);
  const [flipped,setFlipped]=useState(false);
  const [ratings,setRatings]=useState<string[]>([]);

  const config={
    flashcards:{title:"Make Flashcards",eyebrow:"FLASHCARD STUDIO",placeholder:"Paste your lecture note, chapter, slide text or study material..."},
    summary:{title:"Effective Summary",eyebrow:"SUMMARY STUDIO",placeholder:"Paste the material you want to turn into clear revision notes..."},
    explain:{title:"Explain Simply",eyebrow:"EXPLANATION STUDIO",placeholder:"Example: Explain electrolysis in a very easy way..."}
  }[mode];

  async function generate(){
    setBusy(true);setError("");setResult(null);
    const endpoint=`/api/study/${mode}`;
    const body=mode==="flashcards"?{text,count}:mode==="summary"?{text,size}:{text};
    try{
      const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||"Generation failed.");
      setResult(d);setIndex(0);setFlipped(false);
      if(mode==="flashcards") setRatings(Array(d.cards.length).fill(""));
    }catch(e:any){setError(e.message||"Network error. Please try again.")}
    finally{setBusy(false)}
  }

  function copy(){
    if(!result)return;
    navigator.clipboard?.writeText(JSON.stringify(result,null,2));
  }

  return <main className="container">
    <div className="page-head"><button className="back" onClick={()=>history.back()} aria-label="Go back">‹</button><div><div className="eyebrow">{config.eyebrow}</div><h1>{config.title}</h1></div></div>
    <div className="panel">
      {mode==="flashcards" ? <label>Paste your notes</label> : <label>{mode==="summary"?"Paste your notes":"What do you want explained?"}</label>}
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={config.placeholder} aria-label="Study material" />
      {mode==="flashcards" && <div className="row"><select value={count} onChange={e=>setCount(Number(e.target.value))}><option value={10}>10 cards</option><option value={20}>20 cards</option><option value={30}>30 cards</option><option value={40}>40 cards</option></select><button className="primary" onClick={generate} disabled={busy}>{busy?"Generating…":"Generate Flashcards"}</button></div>}
      {mode==="summary" && <>
        <label style={{marginTop:10}}>Summary length</label>
        <div className="seg"><button className={size==="detailed"?"active":""} onClick={()=>setSize("detailed")}>Detailed</button><button className={size==="medium"?"active":""} onClick={()=>setSize("medium")}>Medium</button><button className={size==="quick"?"active":""} onClick={()=>setSize("quick")}>Quick</button></div>
        <button className="primary wide" onClick={generate} disabled={busy}>{busy?"Generating…":"Create Effective Summary"}</button>
      </>}
      {mode==="explain" && <button className="primary wide" onClick={generate} disabled={busy}>{busy?"Generating…":"Explain It Simply"}</button>}
      <p className="hint">Real AI is called securely on the server. API keys are never sent to the browser.</p>
    </div>

    {error && <div className="result error"><h2>Something went wrong</h2><p>{error}</p><button className="secondary" onClick={generate} disabled={busy}>Retry</button></div>}

    {result && mode==="flashcards" && <FlashcardsResult result={result} index={index} setIndex={setIndex} flipped={flipped} setFlipped={setFlipped} ratings={ratings} setRatings={setRatings} />}
    {result && mode==="summary" && <SummaryResult result={result} copy={copy} />}
    {result && mode==="explain" && <ExplainResult result={result} copy={copy} />}
  </main>
}

function FlashcardsResult({result,index,setIndex,flipped,setFlipped,ratings,setRatings}:any){
  const card=result.cards[index], total=result.cards.length, pct=Math.round(((index+1)/total)*100);
  const rate=(value:string)=>{const next=[...ratings];next[index]=value;setRatings(next);setFlipped(true)};
  return <div className="result">
    <div className="meta"><span>Card {index+1} of {total}</span><span>{pct}%</span></div><div className="bar"><i style={{width:`${pct}%`}} /></div>
    <div className="flash"><div><div className="flabel">{flipped?"ANSWER":"QUESTION"}</div><div className={flipped?"fa":"fq"}>{flipped?card.answer:card.question}</div>{flipped&&card.explanation&&<div className="why"><b>Why:</b> {card.explanation}</div>}</div></div>
    <div className="flash-buttons"><button onClick={()=>{setIndex((index-1+total)%total);setFlipped(false)}}>Previous</button><button className="flip" onClick={()=>setFlipped(!flipped)}>{flipped?"Show Question":"Flip Card"}</button><button onClick={()=>{setIndex((index+1)%total);setFlipped(false)}}>Next</button></div>
    <div className="ratings"><button onClick={()=>rate("Didn't know")}>🔴 Didn't know</button><button onClick={()=>rate("Partly knew")}>🟡 Partly knew</button><button onClick={()=>rate("Knew it")}>🟢 Knew it</button></div>
    {ratings[index]&&<p className="hint">Marked: {ratings[index]}</p>}
  </div>
}

function SummaryResult({result,copy}:any){
  return <div className="result"><div className="result-actions"><button className="secondary" onClick={copy}>Copy</button></div><h2>{result.title}</h2><p>{result.summary}</p><h3>🔑 Key points</h3><ul>{(result.key_points||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul><h3>📌 Key terms</h3><ul>{(result.terms||[]).map((x:string,i:number)=><li key={i}>{x}</li>)}</ul></div>
}
function ExplainResult({result,copy}:any){
  return <div className="result"><div className="result-actions"><button className="secondary" onClick={copy}>Copy</button></div><h2>👶 Simple explanation</h2><p>{result.simple}</p><h3>🧩 Think of it like this</h3><p>{result.analogy}</p><h3>💡 Example</h3><p>{result.example}</p><h3>🧠 Remember</h3><p>{result.remember}</p></div>
}
