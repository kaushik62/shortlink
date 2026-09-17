import React from "react";

export default function PremiumHero() {
  return (
    <main className="premium-page">
      <nav className="premium-nav">
        <a href="/" className="premium-brand">
          <span className="brand-mark">↗</span>
          <span>Shortly</span>
        </a>
        <div style={{display:"flex", gap:10}}>
          <a href="/login" style={{padding:"10px 14px", textDecoration:"none", color:"#344054", fontWeight:700}}>Log in</a>
          <a href="/signup" style={{padding:"10px 15px", textDecoration:"none", color:"#fff", background:"linear-gradient(135deg,#5b5ce2,#7c3aed)", borderRadius:11, fontWeight:800}}>Get started</a>
        </div>
      </nav>

      <section className="premium-hero">
        <div>
          <span className="hero-eyebrow">FAST · CLEAN · SECURE</span>
          <h1 className="hero-title">
            Turn long links into
            <br />
            <span className="hero-gradient">short, memorable URLs.</span>
          </h1>
          <p className="hero-copy">
            A simple URL shortener built for speed. Create compact 5–7 character
            links backed by PostgreSQL BIGINT, Base62 encoding, Redis caching,
            and secure JWT authentication.
          </p>
          <div style={{display:"flex", gap:12, marginTop:26, flexWrap:"wrap"}}>
            <a href="/signup" style={{padding:"13px 19px", background:"#111827", color:"#fff", borderRadius:13, textDecoration:"none", fontWeight:800}}>
              Start shortening →
            </a>
            <a href="#features" style={{padding:"13px 19px", border:"1px solid #dfe2ea", color:"#344054", borderRadius:13, textDecoration:"none", fontWeight:750, background:"#fff"}}>
              See how it works
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div style={{fontSize:12, fontWeight:800, letterSpacing:".08em", color:"#667085", marginBottom:12}}>LIVE PREVIEW</div>
          <div className="hero-url-box">
            <div className="hero-url-input">
              <span style={{opacity:.65}}>https://</span>
              <span>example.com/your/very/long/link</span>
            </div>
            <div className="hero-short">
              <div style={{fontSize:11, color:"#c4b5fd", marginBottom:5}}>SHORT LINK</div>
              <div style={{fontSize:22, fontWeight:850}}>shortly.app/Ab3xY7</div>
            </div>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:14}}>
            <div><b>BIGINT</b><div style={{fontSize:12,color:"#667085"}}>ID space</div></div>
            <div><b>BASE62</b><div style={{fontSize:12,color:"#667085"}}>Encoding</div></div>
            <div><b>REDIS</b><div style={{fontSize:12,color:"#667085"}}>Fast reads</div></div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-strip">
        <article className="feature-card"><h3>5–7 character links</h3><p>Sequential BIGINT IDs are encoded with Base62 to produce compact unique short codes.</p></article>
        <article className="feature-card"><h3>Fast redirects</h3><p>Redis can cache short-code lookups so frequently visited links resolve quickly.</p></article>
        <article className="feature-card"><h3>Private dashboard</h3><p>JWT authentication keeps each user's links and click analytics scoped to their account.</p></article>
      </section>
    </main>
  );
}
