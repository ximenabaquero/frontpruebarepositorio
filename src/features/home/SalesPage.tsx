"use client";
import { useEffect } from "react";

const SVG_DEFS = `
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></symbol>
  <symbol id="i-msg" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.4a8.4 8.4 0 0 1-.9-4 8.5 8.5 0 0 1 17 0z"/></symbol>
  <symbol id="i-sheet" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></symbol>
  <symbol id="i-ghost" viewBox="0 0 24 24"><path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-2 3 2 2-2 2 2 3-2 3 2V10a8 8 0 0 0-8-8z"/></symbol>
  <symbol id="i-hourglass" viewBox="0 0 24 24"><path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4l-3.4-3.6a1 1 0 0 1 0-1.4l3.4-3.6a2 2 0 0 0 .6-1.4V2M7 22v-4.2c0-.5.2-1 .6-1.4l3.4-3.6a1 1 0 0 0 0-1.4L7.6 7.8A2 2 0 0 1 7 6.4V2"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
  <symbol id="i-shield-check" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></symbol>
  <symbol id="i-hospital" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01M12 17v4"/></symbol>
  <symbol id="i-stethoscope" viewBox="0 0 24 24"><path d="M4.8 2.3A.3.3 0 0 0 4.5 2H3a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1.5a.3.3 0 0 0-.3.3v1.4a.3.3 0 0 0 .3.3H11v3a4 4 0 1 1-8 0V4h1.5a.3.3 0 0 0 .3-.3z"/><circle cx="20" cy="10" r="2"/><path d="M18 10v3a6 6 0 0 1-6 6v0a5 5 0 0 1-5-5v-1"/></symbol>
  <symbol id="i-home" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></symbol>
  <symbol id="i-dollar" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.65" y2="16.65"/></symbol>
  <symbol id="i-bars" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></symbol>
  <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></symbol>
  <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></symbol>
  <symbol id="i-clipboard" viewBox="0 0 24 24"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></symbol>
  <symbol id="i-zap" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></symbol>
  <symbol id="i-trending" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></symbol>
  <symbol id="i-smartphone" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18.01"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><polygon points="12 2 15.1 8.5 22 9.5 17 14.4 18.2 21.5 12 18.2 5.8 21.5 7 14.4 2 9.5 8.9 8.5 12 2"/></symbol>
  <symbol id="i-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></symbol>
  <symbol id="i-circle-dot" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></symbol>
  <symbol id="i-phone-call" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/><path d="M14 4a4 4 0 0 1 4 4M14 1a7 7 0 0 1 7 7"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></symbol>
  <symbol id="i-pencil" viewBox="0 0 24 24"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></symbol>
  <symbol id="i-bell" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></symbol>
  <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></symbol>
  <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></symbol>
  <symbol id="i-brain" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4.5 16a2.5 2.5 0 0 1-1.62-4.4 2.5 2.5 0 0 1 0-3.4A2.5 2.5 0 0 1 4.5 4a2.5 2.5 0 0 1 2.54-2.06A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19.5 16a2.5 2.5 0 0 0 1.62-4.4 2.5 2.5 0 0 0 0-3.4A2.5 2.5 0 0 0 19.5 4a2.5 2.5 0 0 0-2.54-2.06A2.5 2.5 0 0 0 14.5 2z"/></symbol>
  <symbol id="i-activity" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></symbol>
  <symbol id="i-building" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></symbol>
  <symbol id="i-arrow-right" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></symbol>
`;

const Ico = ({ id, style }: { id: string; style?: React.CSSProperties }) => (
  <svg className="icon" style={style}><use href={`#${id}`} /></svg>
);

export default function SalesPage() {
  useEffect(() => {
    const reveals = document.querySelectorAll<Element>(".sp2 .reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach((r) => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sp2">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800&family=Instrument+Serif:ital@0;1&display=swap');
        html{scroll-behavior:smooth}
        .sp2{--bg:#FAFDFB;--bg-2:#F0FBF6;--surface:#FFFFFF;--surface-2:#F5FAF8;--mint:#0FB888;--mint-bright:#0AA577;--mint-soft:#C4FBE9;--mint-dim:rgba(15,184,136,.10);--mint-glow:rgba(15,184,136,.22);--white:#0A1F1A;--text:#1F3A33;--text-mid:#4A6B62;--text-dim:#7A9189;--line:rgba(10,31,26,.10);--line-soft:rgba(10,31,26,.05);--critical:#E85D5D;--warn:#D97706;--ok:#0FB888;--font-display:'Instrument Serif',serif;--font-body:'DM Sans',sans-serif;font-family:var(--font-body);background:var(--bg);color:var(--text);overflow-x:hidden;-webkit-font-smoothing:antialiased;min-height:100vh}
        .sp2 *{margin:0;padding:0;box-sizing:border-box}
        .sp2 .icon{width:1.5em;height:1.5em;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;display:inline-block;vertical-align:middle}
        .sp2 nav{position:fixed;top:0;width:100%;z-index:100;background:rgba(250,253,251,.78);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border-bottom:1px solid var(--line);padding:14px 32px;display:flex;align-items:center;justify-content:space-between}
        .sp2 .nav-logo{font-family:var(--font-body);font-size:1.65rem;color:var(--white);font-weight:800;letter-spacing:-1.5px;line-height:1}
        .sp2 .nav-logo span{color:var(--white)}
        .sp2 .nav-links{display:flex;gap:6px;align-items:center;background:rgba(15,184,136,.07);border:1px solid var(--mint-glow);border-radius:999px;padding:4px 6px}
        .sp2 .nav-links a{color:var(--text-mid);text-decoration:none;font-size:.8rem;font-weight:500;padding:5px 14px;border-radius:999px;transition:background .2s,color .2s}
        .sp2 .nav-links a:hover{color:var(--mint);background:rgba(15,184,136,.12)}
        .sp2 section{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:100px 40px 80px;max-width:1200px;margin:0 auto;position:relative}
        .sp2 .section-tag{font-size:.7rem;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--mint);margin-bottom:14px}
        .sp2 .hero{text-align:center;align-items:center}
        .sp2 .hero h1{font-family:var(--font-display);font-size:clamp(2.4rem,6vw,4.4rem);color:var(--white);line-height:1.12;margin-bottom:18px;font-weight:400;max-width:900px}
        .sp2 .hero h1 em{color:var(--mint);font-style:italic}
        .sp2 .hero p{font-size:1.05rem;color:var(--text);max-width:660px;line-height:1.7}
        .sp2 .hero-stat-row{display:flex;gap:32px;margin-top:52px;flex-wrap:wrap;justify-content:center}
        .sp2 .hero-stat{text-align:center}
        .sp2 .hero-stat-num{font-family:var(--font-display);font-size:2.6rem;color:var(--mint);line-height:1}
        .sp2 .hero-stat-label{font-size:.74rem;color:var(--text-mid);margin-top:6px;max-width:130px}
        .sp2 .problem{background:var(--bg-2);border-radius:24px;margin:40px auto;padding:80px 48px;max-width:1200px}
        .sp2 .problem h2{font-family:var(--font-display);font-size:clamp(2rem,4vw,3rem);color:var(--white);margin-bottom:14px;font-weight:400}
        .sp2 .problem h2 em{color:var(--mint);font-style:italic}
        .sp2 .problem>p{color:var(--text);font-size:1rem;max-width:720px;line-height:1.7;margin-bottom:44px}
        .sp2 .chaos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:40px}
        .sp2 .chaos-card{background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:14px;padding:22px;position:relative;transition:border-color .2s}
        .sp2 .chaos-card:hover{border-color:var(--mint-glow)}
        .sp2 .chaos-card .icon-wrap{width:36px;height:36px;border-radius:10px;background:var(--mint-dim);color:var(--mint);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
        .sp2 .chaos-card .icon-wrap .icon{width:1.15rem;height:1.15rem}
        .sp2 .chaos-card h4{color:var(--white);font-size:.92rem;font-weight:600;margin-bottom:6px}
        .sp2 .chaos-card p{font-size:.82rem;color:var(--text-mid);line-height:1.55}
        .sp2 .silence-box{background:linear-gradient(135deg,rgba(61,219,167,.04),rgba(61,219,167,.01));border:1px solid var(--mint-glow);border-radius:18px;padding:36px;text-align:center}
        .sp2 .silence-box h3{font-family:var(--font-display);font-size:1.9rem;color:var(--white);margin-bottom:10px;line-height:1.3}
        .sp2 .silence-word{color:var(--critical);font-style:italic}
        .sp2 .silence-box p{font-size:.92rem;color:var(--text-mid);max-width:640px;margin:0 auto;line-height:1.65}
        .sp2 .solution h2{font-family:var(--font-display);font-size:clamp(2rem,4vw,3rem);color:var(--white);margin-bottom:10px;font-weight:400}
        .sp2 .solution h2 em{color:var(--mint);font-style:italic}
        .sp2 .solution>p{color:var(--text);font-size:1rem;max-width:720px;line-height:1.7;margin-bottom:44px}
        .sp2 .flow-container{position:relative;display:flex;flex-direction:column;gap:0}
        .sp2 .flow-step{display:flex;align-items:flex-start;gap:22px;position:relative;padding:22px 0}
        .sp2 .flow-line{position:absolute;left:19px;top:46px;width:2px;height:calc(100% - 24px);background:linear-gradient(to bottom,var(--mint),var(--mint-glow))}
        .sp2 .flow-dot{width:40px;height:40px;min-width:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:700;color:var(--bg);background:var(--mint);position:relative;z-index:2;font-family:var(--font-body)}
        .sp2 .flow-content h4{color:var(--white);font-size:1rem;font-weight:600;margin-bottom:6px}
        .sp2 .flow-content p{color:var(--text-mid);font-size:.86rem;line-height:1.6}
        .sp2 .actors{padding:80px 40px;max-width:1200px;margin:0 auto}
        .sp2 .actors>h2{font-family:var(--font-display);font-size:clamp(2rem,4vw,3rem);color:var(--white);margin-bottom:48px;font-weight:400}
        .sp2 .actors>h2 em{color:var(--mint);font-style:italic}
        .sp2 .actor-block{margin-bottom:72px}
        .sp2 .actor-header{display:flex;align-items:center;gap:16px;margin-bottom:24px}
        .sp2 .actor-icon{width:52px;height:52px;border-radius:14px;background:var(--mint-dim);color:var(--mint);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sp2 .actor-icon .icon{width:1.5rem;height:1.5rem}
        .sp2 .actor-name{font-size:1.25rem;font-weight:700;color:var(--white)}
        .sp2 .actor-sub{font-size:.8rem;color:var(--text-dim);margin-top:2px}
        .sp2 .actor-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:24px;align-items:start}
        .sp2 .actor-mock{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:22px;min-height:280px}
        .sp2 .mock-bar{display:flex;gap:6px;margin-bottom:16px}
        .sp2 .mock-d{width:8px;height:8px;border-radius:50%;background:rgba(10,31,26,.18)}
        .sp2 .mock-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .sp2 .mock-grid.g4{grid-template-columns:1fr 1fr 1fr 1fr}
        .sp2 .mock-card{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:14px}
        .sp2 .mock-label{font-size:.62rem;font-weight:700;letter-spacing:.6px;text-transform:uppercase;margin-bottom:6px}
        .sp2 .mock-label.g{color:var(--mint)}.sp2 .mock-label.r{color:var(--critical)}.sp2 .mock-label.p{color:var(--mint-bright)}.sp2 .mock-label.o{color:var(--mint)}.sp2 .mock-label.w{color:var(--text-mid)}
        .sp2 .mock-big{font-family:var(--font-display);font-size:1.7rem;color:var(--white);line-height:1}
        .sp2 .mock-sm{font-size:.68rem;color:var(--text-dim);margin-top:4px;line-height:1.4}
        .sp2 .mock-progress{height:4px;background:rgba(10,31,26,.08);border-radius:2px;margin-top:8px;overflow:hidden}
        .sp2 .mock-fill{height:100%;border-radius:2px;background:var(--mint)}
        .sp2 .mock-list{list-style:none}
        .sp2 .mock-list li{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--line-soft);font-size:.74rem;color:var(--text-mid);line-height:1.4}
        .sp2 .mock-list li:last-child{border-bottom:none}
        .sp2 .mock-status{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .sp2 .mock-status.green{background:var(--mint)}.sp2 .mock-status.yellow{background:var(--warn)}.sp2 .mock-status.red{background:var(--critical)}
        .sp2 .actor-benefits{display:flex;flex-direction:column;gap:12px}
        .sp2 .benefit{background:rgba(255,255,255,.025);border:1px solid var(--line);border-radius:12px;padding:16px 18px;display:flex;align-items:flex-start;gap:14px;transition:border-color .2s}
        .sp2 .benefit:hover{border-color:var(--mint-glow)}
        .sp2 .benefit-icon{width:32px;height:32px;border-radius:9px;background:var(--mint-dim);color:var(--mint);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sp2 .benefit-icon .icon{width:1.1rem;height:1.1rem}
        .sp2 .benefit h5{color:var(--white);font-size:.86rem;font-weight:600;margin-bottom:3px}
        .sp2 .benefit p{font-size:.76rem;color:var(--text-mid);line-height:1.5}
        .sp2 .phone-row{display:flex;gap:24px;justify-content:center;flex-wrap:wrap}
        .sp2 .phone{width:220px;background:var(--surface);border:2px solid var(--line);border-radius:26px;padding:12px 14px 18px;position:relative}
        .sp2 .phone::before{content:'';position:absolute;top:6px;left:50%;transform:translateX(-50%);width:42px;height:4px;background:rgba(10,31,26,.12);border-radius:2px}
        .sp2 .phone-title{font-size:.62rem;color:var(--text-mid);text-align:center;margin:10px 0 8px;font-weight:500}
        .sp2 .phone .mock-card{padding:10px;margin-bottom:6px}
        .sp2 .phone-btn{display:flex;align-items:center;justify-content:center;gap:6px;text-align:center;padding:10px;border-radius:8px;font-size:.72rem;font-weight:600;margin-top:8px}
        .sp2 .phone-btn.primary{background:var(--mint);color:var(--bg)}
        .sp2 .phone-btn.outline{border:1px solid var(--line);color:var(--text-mid)}
        .sp2 .phone-btn .icon{width:.9rem;height:.9rem}
        .sp2 .vitals{display:flex;gap:6px;margin-top:6px}
        .sp2 .vital{flex:1;text-align:center;background:rgba(15,184,136,.06);border-radius:6px;padding:6px 2px}
        .sp2 .vital-n{font-size:.82rem;font-weight:700;color:var(--white)}
        .sp2 .vital-l{font-size:.55rem;color:var(--text-dim);margin-top:2px}
        .sp2 .subsection-tag{font-size:.65rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--mint);margin:32px 0 16px}
        .sp2 .features{text-align:center}
        .sp2 .features h2{font-family:var(--font-display);font-size:clamp(2rem,4vw,3rem);color:var(--white);margin-bottom:14px;font-weight:400}
        .sp2 .features h2 em{color:var(--mint);font-style:italic}
        .sp2 .features>p{color:var(--text);max-width:620px;margin:0 auto 44px;font-size:.96rem;line-height:1.7}
        .sp2 .feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;text-align:left}
        .sp2 .feat{background:rgba(255,255,255,.025);border:1px solid var(--line);border-radius:14px;padding:22px;transition:.2s}
        .sp2 .feat:hover{border-color:var(--mint-glow);transform:translateY(-2px)}
        .sp2 .feat-icon{width:38px;height:38px;border-radius:10px;background:var(--mint-dim);color:var(--mint);display:flex;align-items:center;justify-content:center;margin-bottom:12px}
        .sp2 .feat-icon .icon{width:1.15rem;height:1.15rem}
        .sp2 .feat h4{color:var(--white);font-size:.92rem;font-weight:600;margin-bottom:6px}
        .sp2 .feat p{font-size:.78rem;color:var(--text-mid);line-height:1.5}
        .sp2 .phase2{text-align:center}
        .sp2 .phase2 h2{font-family:var(--font-display);font-size:clamp(2rem,4vw,3rem);color:var(--white);margin-bottom:10px;font-weight:400}
        .sp2 .phase2 h2 em{color:var(--mint);font-style:italic}
        .sp2 .phase2>p{color:var(--text);font-size:1rem;max-width:660px;margin:0 auto 44px;line-height:1.7}
        .sp2 .phase2-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px}
        .sp2 .p2-card{background:linear-gradient(180deg,rgba(61,219,167,.05),rgba(61,219,167,.01));border:1px solid var(--mint-glow);border-radius:14px;padding:24px 20px;text-align:center}
        .sp2 .p2-card .icon-wrap{width:42px;height:42px;border-radius:11px;background:var(--mint-dim);color:var(--mint);display:flex;align-items:center;justify-content:center;margin:0 auto 12px}
        .sp2 .p2-card .icon-wrap .icon{width:1.3rem;height:1.3rem}
        .sp2 .p2-card h4{color:var(--mint);font-size:.88rem;font-weight:600;margin-bottom:6px}
        .sp2 .p2-card p{font-size:.76rem;color:var(--text-mid);line-height:1.5}
        .sp2 .phase2-note{font-size:.86rem;color:var(--text-mid);margin:48px auto 0;font-style:italic;line-height:1.65;text-align:center;max-width:680px;background:linear-gradient(135deg,rgba(15,184,136,.06),rgba(15,184,136,.02));border:1px solid var(--mint-glow);border-radius:14px;padding:22px 28px;position:relative}
        .sp2 .phase2-note::before{content:'';position:absolute;top:-1px;left:24px;right:24px;height:2px;background:linear-gradient(90deg,transparent,var(--mint),transparent)}
        .sp2 .cta-section{text-align:center;padding:100px 40px}
        .sp2 .cta-section h2{font-family:var(--font-display);font-size:clamp(2rem,3.6vw,2.6rem);color:var(--white);margin-bottom:14px;font-weight:400}
        .sp2 .cta-section h2 em{color:var(--mint);font-style:italic}
        .sp2 .cta-section>p{color:var(--text);font-size:1rem;margin:0 auto 36px;max-width:540px;line-height:1.7}
        .sp2 .cta-btn{display:inline-flex;align-items:center;gap:8px;background:var(--mint);color:var(--bg);padding:14px 36px;border-radius:10px;font-weight:700;font-size:.92rem;text-decoration:none;transition:.2s}
        .sp2 .cta-btn:hover{background:var(--mint-bright);transform:translateY(-1px)}
        .sp2 .cta-btn .icon{width:1rem;height:1rem}
        .sp2 .cta-footer{font-size:.78rem;color:var(--text-dim);margin-top:28px}
        .sp2 .cta-footer a{color:var(--mint);text-decoration:none}
        .sp2 .cta-footer a:hover{text-decoration:underline}
        .sp2 .cta-footer .sep{color:var(--text-dim);margin:0 10px}
        .sp2 .copyright{font-size:.7rem;color:var(--text-dim);margin-top:18px;letter-spacing:.3px}
        .sp2 .nav-login{display:inline-flex;align-items:center;gap:6px;background:var(--mint);color:var(--bg);text-decoration:none;font-size:.8rem;font-weight:700;padding:7px 18px;border-radius:999px;transition:background .2s,transform .15s;white-space:nowrap;margin-left:12px}
        .sp2 .nav-login:hover{background:var(--mint-bright);transform:translateY(-1px)}
        .sp2 .reveal{opacity:0;transform:translateY(28px);transition:opacity .6s,transform .6s}
        .sp2 .reveal.visible{opacity:1;transform:translateY(0)}
        @media(max-width:768px){
          .sp2 section{padding:90px 18px 60px}
          .sp2 nav{padding:12px 18px}
          .sp2 .nav-links{display:none}
          .sp2 .problem{padding:48px 22px;margin:20px 18px;border-radius:18px}
          .sp2 .actor-grid{grid-template-columns:1fr;gap:18px}
          .sp2 .chaos-grid{grid-template-columns:1fr;gap:12px}
          .sp2 .hero-stat-row{gap:24px;margin-top:40px}
          .sp2 .feat-grid{grid-template-columns:1fr 1fr;gap:12px}
          .sp2 .phone-row{gap:14px}
          .sp2 .phone{width:175px}
          .sp2 .mock-grid.g4{grid-template-columns:1fr 1fr}
          .sp2 .actors{padding:80px 18px 60px}
        }
        @media(max-width:420px){
          .sp2 .feat-grid{grid-template-columns:1fr}
          .sp2 .hero-stat-num{font-size:2.1rem}
          .sp2 .mock-grid{grid-template-columns:1fr}
          .sp2 .phone{width:100%;max-width:280px}
        }
      `}</style>






      {/* FEATURES */}
      <section className="features reveal" id="features">
        <div className="section-tag">Capacidades de la plataforma</div>
        <h2>Todo conectado. Todo <em>verificable.</em></h2>
        <p>Comunicación bidireccional, verificación automática, y visibilidad en tiempo real para cada actor del ecosistema.</p>
        <div className="feat-grid">
          <div className="feat"><div className="feat-icon"><Ico id="i-pin"/></div><h4>Geofencing</h4><p>Verificación GPS automática de que el profesional llegó al domicilio del paciente.</p></div>
          <div className="feat"><div className="feat-icon"><Ico id="i-pencil"/></div><h4>Firma digital</h4><p>El paciente confirma cada servicio recibido directamente en la plataforma.</p></div>
          <div className="feat"><div className="feat-icon"><Ico id="i-bell"/></div><h4>Alertas clínicas</h4><p>Semáforo Verde/Amarillo/Rojo con escalamiento automático si hay deterioro.</p></div>
          <div className="feat"><div className="feat-icon"><Ico id="i-bars"/></div><h4>Dashboards en tiempo real</h4><p>Cada actor ve lo que necesita. Métricas, servicios, pacientes, costos.</p></div>
          <div className="feat"><div className="feat-icon"><Ico id="i-link"/></div><h4>Comunicación bidireccional</h4><p>Hospital ↔ Asegurador ↔ Prestador ↔ Paciente. Todo trazable, todo documentado.</p></div>
          <div className="feat"><div className="feat-icon"><Ico id="i-shield-check"/></div><h4>Anti-fraude</h4><p>Detección automática de visitas fantasma, servicios simultáneos, y anomalías.</p></div>
          <div className="feat"><div className="feat-icon"><Ico id="i-calendar"/></div><h4>Agendamiento inteligente</h4><p>Matching paciente-prestador por disponibilidad, ubicación y especialidad.</p></div>
          <div className="feat"><div className="feat-icon"><Ico id="i-smartphone"/></div><h4>App móvil (PWA)</h4><p>Los profesionales en campo gestionan todo desde su celular. Sin instalar nada.</p></div>
          <div className="feat"><div className="feat-icon"><Ico id="i-star"/></div><h4>Scoring de prestadores</h4><p>Calidad medible: tiempo de respuesta, completitud, satisfacción, compliance GPS.</p></div>
        </div>
      </section>

      {/* PHASE 2 */}
      <section className="phase2 reveal" id="future">
        <div className="section-tag">Fase 2 — Escalamiento</div>
        <h2>De verificación a <em>Hospital en Casa</em></h2>
        <p>Una vez que el ecosistema está conectado y cada servicio verificado, OLGA escala el modelo para habilitar atención hospitalaria completa fuera de la institución.</p>
        <div className="phase2-grid">
          <div className="p2-card"><div className="icon-wrap"><Ico id="i-activity"/></div><h4>Monitoreo IoT continuo</h4><p>Dispositivos médicos certificados en casa del paciente. Signos vitales 24/7 sin depender de visitas.</p></div>
          <div className="p2-card"><div className="icon-wrap"><Ico id="i-brain"/></div><h4>Cerebro clínico</h4><p>Triage inteligente con protocolos por patología. Alertas predictivas antes del deterioro.</p></div>
          <div className="p2-card"><div className="icon-wrap"><Ico id="i-stethoscope"/></div><h4>Panel de enfermería 24/7</h4><p>Equipo clínico monitoreando pacientes en tiempo real desde un centro de comando virtual.</p></div>
          <div className="p2-card"><div className="icon-wrap"><Ico id="i-building"/></div><h4>Hospital en Casa</h4><p>Atención hospitalaria completa en el domicilio. El paciente nunca pisa urgencias si no es necesario.</p></div>
          <div className="p2-card"><div className="icon-wrap"><Ico id="i-trending"/></div><h4>Inteligencia de datos</h4><p>Análisis poblacional, modelos predictivos, y evidencia clínica para todo el ecosistema.</p></div>
        </div>
        <p className="phase2-note">USA acaba de extender 5 años más su programa de Hospital at Home (JAMA, abril 2026).<br/>Esto se viene para Latinoamérica. OLGA es la infraestructura que lo hace posible.</p>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <h2>¿Listo para dar <em>visibilidad</em> a su ecosistema?</h2>
        <p>Conozca cómo OLGA puede transformar la coordinación del cuidado extramural en su organización.</p>
        <a href="mailto:camilocortesu@gmail.com" className="cta-btn">Agendar una conversación <Ico id="i-arrow-right" style={{width:'1rem',height:'1rem'}}/></a>
        <p className="cta-footer">
          <a href="https://olga.health">olga.health</a><span className="sep">|</span>
          <a href="https://www.linkedin.com/in/camilocortesu/" target="_blank" rel="noopener">LinkedIn</a><span className="sep">|</span>
          <a href="https://www.linkedin.com/company/olga-healthtech" target="_blank" rel="noopener">OLGA en LinkedIn</a>
        </p>
        <p className="copyright">© 2026 OLGA Healthtech S.A.S.</p>
      </section>
    </div>
  );
}
