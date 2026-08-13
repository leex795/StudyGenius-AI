"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AppShell({children}:{children:React.ReactNode}){
  const pathname=usePathname(); const router=useRouter();
  async function logout(){await fetch("/api/auth/logout",{method:"POST"});router.push("/login")}
  return <div className="app-shell">
    <header className="topbar">
      <button className="icon-btn" aria-label="Go home" onClick={()=>router.push("/app")}>☰</button>
      <Link href="/app" className="brand"><div className="logo">🧠</div><span className="brand-name">StudyGenius</span><span className="ai-badge">AI</span></Link>
      <button className="icon-btn" aria-label="Sign out" onClick={logout}>↪</button>
    </header>
    {children}
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link href="/app" className={pathname==="/app"?"active":""}>⌂<small>Home</small></Link>
      <Link href="/app/flashcards" className={pathname?.includes("flashcards")?"active":""}>▣<small>Flashcards</small></Link>
      <Link href="/app/summary" className={pathname?.includes("summary")?"active":""}>≡<small>Summary</small></Link>
      <Link href="/app/explain" className={pathname?.includes("explain")?"active":""}>?<small>Explain</small></Link>
    </nav>
  </div>
}
