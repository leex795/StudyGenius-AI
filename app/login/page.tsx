 "use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [mode,setMode]=useState<"login"|"signup">("login");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [status,setStatus]=useState("");
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function submit(e:React.FormEvent){
    e.preventDefault(); setBusy(true); setStatus("");
    const endpoint=mode==="login"?"/api/auth/login":"/api/auth/signup";
    const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password})});
    const d=await r.json();
    setBusy(false);
    if(!r.ok){setStatus(d.error||"Something went wrong.");return}
    router.push("/app");
  }
  return <main className="container">
    <div className="form-card">
      <div className="eyebrow">STUDYGENIUS AI</div>
      <h1>{mode==="login"?"Welcome back":"Create your study account"}</h1>
      <p>{mode==="login"?"Turn your material into focused learning.":"Your saved flashcards, summaries and explanations will stay with your account."}</p>
      <form className="panel form-stack" onSubmit={submit}>
        {mode==="signup" && <div><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required /></div>}
        <div><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></div>
        <div><label>Password</label><input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete={mode==="login"?"current-password":"new-password"} required /></div>
        <button className="primary" disabled={busy}>{busy?"Working…":mode==="login"?"Sign in":"Create account"}</button>
        <div className={"status "+(status?"error-text":"")}>{status}</div>
        <button type="button" className="secondary" onClick={()=>setMode(mode==="login"?"signup":"login")}>
          {mode==="login"?"Create a new account":"I already have an account"}
        </button>
      </form>
    </div>
  </main>
}
