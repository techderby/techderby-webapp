import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────

const agendaItems = [
  { time: '09:00', title: 'Arrival, registration and networking',             desc: 'Coffee, welcome desk and partner conversations' },
  { time: '09:30', title: 'Opening remarks',                                  desc: 'Welcome to Tech Derby Summit 2026' },
  { time: '09:45', title: 'Keynote: AI, Startups and the Next Digital Economy', desc: 'A practical view of the opportunity ahead', keynote: true },
  { time: '10:30', title: 'Panel: AI for business growth and productivity',   desc: 'How organisations are using AI responsibly' },
  { time: '11:15', title: 'Founder spotlight',                                desc: 'Stories from startup builders and ecosystem leaders' },
  { time: '12:00', title: 'Networking and partner showcase',                  desc: 'Meet founders, educators, employers and investors' },
];

const themes = [
  { title: 'AI for Practical Impact',        desc: 'Exploring how AI can create real value across business, work and society.' },
  { title: 'Startups and Entrepreneurship',  desc: 'Spotlighting founders, venture growth and the support needed to build well.' },
  { title: 'Local Talent and Future Skills', desc: 'Connecting learners, emerging talent and employers to meaningful opportunities.' },
  { title: 'Responsible Innovation',         desc: 'Championing leadership, trust, governance and inclusion in digital change.' },
];

const attendees = [
  'Startup founders and aspiring entrepreneurs',
  'Professionals in tech, product, digital and data',
  'Students, graduates and career changers',
  'Universities, educators and training providers',
  'Employers, partners, funders and ecosystem supporters',
  'Community leaders interested in access and inclusion',
];

const outcomes = [
  'That Derby has talent and ambition.',
  'That this summit is credible, modern and worth attending.',
  'That the event is part of a wider regional movement through East Mids Tech Week.',
  'That Tech Derby is convening community, innovation and opportunity in one place.',
];

const speakers = [
  { initials: 'KS', role: 'Keynote Speaker',   area: 'AI, innovation and business leadership' },
  { initials: 'FS', role: 'Founder Speaker',    area: 'Startup growth and venture building' },
  { initials: 'EL', role: 'Ecosystem Leader',   area: 'Regional collaboration and future skills' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function TechDerbySummitPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby Summit 2026 | AI, Startups and the Next Digital Economy"
        description="A bold regional gathering for founders, professionals, students, educators, employers and ecosystem leaders shaping Derby's digital future. 15 June 2026, Derby."
      />

      {/* ── WHOLE PAGE SHELL ─────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(180deg,#0c1829 0%,#0c1829 35%,#0d2030 55%,#0c2535 75%,#0b2d3c 100%)' }}>

        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0 52px' }}>
          {/* Cyan glow – top-right */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-80px',
            width: '520px', height: '520px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.20) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          {/* Blue glow – top-centre */}
          <div style={{
            position: 'absolute', top: '-40px', left: '30%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

            {/* Badge */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                border: '1px solid rgba(6,182,212,0.35)',
                background: 'rgba(6,182,212,0.08)',
                borderRadius: '999px', padding: '6px 14px',
                fontSize: '11px', fontWeight: 600, color: '#67e8f9',
                letterSpacing: '0.03em',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22d3ee', flexShrink: 0 }} />
                Part of East Mids Tech Week 2026
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              margin: 0, fontWeight: 900, lineHeight: 1.07, letterSpacing: '-0.02em',
              color: '#ffffff', fontSize: 'clamp(2rem, 5vw, 3rem)', maxWidth: '560px',
            }}>
              Tech Derby Summit 2026
            </h1>

            {/* Cyan subtitle */}
            <p style={{
              margin: '10px 0 0', fontWeight: 700, fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: '#22d3ee', lineHeight: 1.3,
            }}>
              AI, Startups and the Next Digital Economy
            </p>

            {/* Description */}
            <p style={{
              margin: '14px 0 0', maxWidth: '360px', fontSize: '14px',
              lineHeight: 1.65, color: 'rgba(255,255,255,0.68)',
            }}>
              A bold regional gathering for founders, professionals, students, educators,
              employers and ecosystem leaders shaping Derby's digital future.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
              <Link to="/events/browse" style={{ textDecoration: 'none' }}>
                <button style={{
                  height: '42px', padding: '0 22px', borderRadius: '8px',
                  background: '#06b6d4', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 700, color: '#0c1829',
                }}>
                  Register for the Summit
                </button>
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <button style={{
                  height: '42px', padding: '0 22px', borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.28)',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#ffffff',
                }}>
                  Become a Partner
                </button>
              </Link>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '28px' }}>
              {[
                { value: '15 June 2026', label: 'Event date' },
                { value: 'Derby',        label: 'Location' },
                { value: 'Founders / AI', label: 'Core focus' },
              ].map((s) => (
                <div key={s.label} style={{
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '10px', padding: '10px 18px',
                }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#fff' }}>{s.value}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.42)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CONFERENCE THEME
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '48px 0 52px' }}>
          {/* Large amber glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '10%',
            transform: 'translateY(-50%)',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,146,60,0.22) 0%, rgba(249,115,22,0.12) 35%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
            position: 'relative', zIndex: 1,
            display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '32px', alignItems: 'center',
          }}>

            {/* Circular photo */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                width: '300px', height: '300px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#1c3040 0%,#1e2d40 50%,#162436 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 0 80px rgba(249,115,22,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', margin: 0, textAlign: 'center' }}>
                  Event photo
                </p>
              </div>
            </div>

            {/* Cards column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Conference Theme card */}
              <div style={{
                background: 'rgba(255,255,255,0.045)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '18px 20px',
              }}>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
                  Conference Theme
                </p>
                <h2 style={{ margin: '8px 0 0', fontSize: '18px', fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                  AI, Startups and the Next<br />Digital Economy
                </h2>
                <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.58)' }}>
                  Practical conversations on innovation, local talent, responsible leadership and regional growth.
                </p>
              </div>

              {/* Featured session card */}
              <div style={{
                background: 'rgba(255,255,255,0.045)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                    AI for Business Growth and Productivity
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.38)' }}>
                    Featured session
                  </p>
                </div>
                <span style={{
                  flexShrink: 0,
                  background: 'rgba(6,182,212,0.15)',
                  border: '1px solid rgba(6,182,212,0.30)',
                  borderRadius: '999px', padding: '3px 10px',
                  fontSize: '11px', fontWeight: 600, color: '#22d3ee',
                }}>
                  Live panel
                </span>
              </div>

              {/* Audience + Experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Audience',   text: 'Founders, students, employers and ecosystem partners' },
                  { label: 'Experience', text: 'Keynotes, panels, networking and collaboration' },
                ].map((c) => (
                  <div key={c.label} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px', padding: '14px 16px',
                  }}>
                    <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      {c.label}
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            ABOUT THE SUMMIT
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{
          position: 'relative', padding: '52px 0 56px',
          background: 'linear-gradient(180deg, rgba(6,182,212,0.04) 0%, rgba(6,182,212,0.07) 100%)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
              About the Summit
            </p>
            <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, lineHeight: 1.15, color: '#fff', letterSpacing: '-0.01em' }}>
              A conference rooted in Derby,<br />connected to the wider East Midlands
            </h2>

            {/* Body card */}
            <div style={{
              marginTop: '20px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '18px 20px',
            }}>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)' }}>
                Tech Derby Summit 2026 is a meeting point for ideas, ambition and practical action. It brings together those building
                startups, shaping talent, driving digital transformation and opening doors for others. As part of East Mids Tech Week,
                the summit places Derby within a wider regional story of innovation, connectivity and future-facing growth.
              </p>
            </div>

            {/* 2×2 theme cards */}
            <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {themes.map((t) => (
                <div key={t.title} style={{
                  background: 'rgba(10,20,38,0.75)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px', padding: '18px 20px',
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                }}>
                  <span style={{
                    flexShrink: 0, marginTop: '3px',
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: 'rgba(148,163,184,0.45)',
                  }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#fff' }}>{t.title}</p>
                    <p style={{ margin: '5px 0 0', fontSize: '12px', lineHeight: 1.55, color: 'rgba(255,255,255,0.52)' }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            AGENDA PREVIEW
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: '52px 0 56px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '10%', right: '-80px',
            width: '450px', height: '450px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
                  Agenda Preview
                </p>
                <h2 style={{ margin: '8px 0 0', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>
                  A day of insight, connection and momentum
                </h2>
              </div>
              <button style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '10px', padding: '10px 20px',
                fontSize: '13px', fontWeight: 600, color: '#fff', cursor: 'pointer',
              }}>
                View full agenda
              </button>
            </div>

            {/* Timeline */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden',
            }}>
              {agendaItems.map((item, i) => (
                <div key={item.time} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '24px',
                  padding: '18px 24px',
                  borderBottom: i < agendaItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  background: item.keynote ? 'rgba(249,115,22,0.06)' : 'transparent',
                }}>
                  <span style={{ width: '44px', flexShrink: 0, fontSize: '13px', fontWeight: 800, color: '#22d3ee' }}>
                    {item.time}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: item.keynote ? '14px' : '13px', fontWeight: 700, color: '#fff' }}>
                      {item.title}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: item.keynote ? 'rgba(252,211,77,0.55)' : 'rgba(255,255,255,0.42)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            WHO SHOULD ATTEND
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '52px 0 56px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
              Who Should Attend
            </p>
            <h2 style={{ margin: '10px 0 28px', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>
              Built for builders, learners,<br />partners and leaders
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Attendee pill list */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '20px',
              }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {attendees.map((a) => (
                    <li key={a} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '999px', padding: '8px 16px',
                    }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22d3ee', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.78)' }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conference outcomes */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px', padding: '20px',
              }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
                  Conference Outcomes
                </p>
                <h3 style={{ margin: '10px 0 0', fontSize: '1.2rem', fontWeight: 900, color: '#fff', lineHeight: 1.25 }}>
                  What this page should<br />make visitors feel
                </h3>
                <ul style={{ margin: '20px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {outcomes.map((o) => (
                    <li key={o} style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(180,230,235,0.65)' }}>{o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SPEAKERS
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: '52px 0 56px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '20%', left: '8%',
            width: '350px', height: '350px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
              Speakers
            </p>
            <h2 style={{ margin: '10px 0 28px', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>
              Featured voices and future-facing conversations
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
              {speakers.map((s) => (
                <div key={s.initials} style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px', padding: '22px',
                }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#22d3ee,#3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: 900, color: '#fff',
                  }}>
                    {s.initials}
                  </div>
                  <p style={{ margin: '18px 0 0', fontSize: '15px', fontWeight: 700, color: '#fff' }}>{s.role}</p>
                  <p style={{ margin: '5px 0 0', fontSize: '12px', lineHeight: 1.55, color: 'rgba(255,255,255,0.52)' }}>{s.area}</p>
                  <p style={{ margin: '18px 0 0', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(34,211,238,0.65)' }}>
                    Photo + Bio Placeholder
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PARTNERS & SPONSORS
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: '52px 0 56px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
              Partners and Sponsors
            </p>
            <h2 style={{ margin: '10px 0 28px', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>
              Support the summit. Shape the ecosystem.
            </h2>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '1fr 1fr',
            }}>
              {/* Left */}
              <div style={{ padding: '28px 32px' }}>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.60)', maxWidth: '320px' }}>
                  Align your organisation with a growing regional platform focused on founders,
                  digital talent, responsible innovation and long-term ecosystem building.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
                  <Link to="/contact" style={{ textDecoration: 'none' }}>
                    <button style={{
                      height: '40px', padding: '0 20px', borderRadius: '8px',
                      background: '#06b6d4', border: 'none', cursor: 'pointer',
                      fontSize: '13px', fontWeight: 700, color: '#0c1829',
                    }}>
                      Become a Partner
                    </button>
                  </Link>
                  <Link to="/contact" style={{ textDecoration: 'none' }}>
                    <button style={{
                      height: '40px', padding: '0 20px', borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.25)',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: '#fff',
                    }}>
                      Sponsorship Pack
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right – logo grid */}
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', padding: '28px 32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {['Partner logo', 'Sponsor logo', 'University', 'Community'].map((label) => (
                    <div key={label} style={{
                      height: '76px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{
          position: 'relative', overflow: 'hidden', padding: '60px 0 72px',
          background: 'linear-gradient(180deg,#0b2d3c 0%,#0c3a48 40%,#0d4455 100%)',
        }}>
          {/* Top hairline glow */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.35),transparent)',
          }} />
          <div style={{
            position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
            width: '700px', height: '260px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
            position: 'relative', zIndex: 1,
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '32px',
          }}>
            {/* Text */}
            <div style={{ maxWidth: '520px' }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
                Final Call to Action
              </p>
              <h2 style={{ margin: '10px 0 0', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15 }}>
                Join the conversation shaping Derby's next digital chapter
              </h2>
              <p style={{ margin: '12px 0 0', fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.58)' }}>
                Come to learn, connect and contribute. Be part of a summit that gathers the people,
                ideas and partnerships shaping the next digital economy.
              </p>
            </div>

            {/* Buttons stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '180px' }}>
              <Link to="/events/browse" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', height: '46px', padding: '0 28px', borderRadius: '8px',
                  background: '#06b6d4', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 700, color: '#0c1829',
                }}>
                  Register Now
                </button>
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%', height: '46px', padding: '0 28px', borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.25)',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#22d3ee',
                }}>
                  Partnership
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}


// ── Data ─────────────────────────────────────────────────────────────────────

const agendaItems = [
  {
    time: '09:00',
    title: 'Arrival, registration and networking',
    desc: 'Coffee, welcome desk and partner conversations',
  },
  {
    time: '09:30',
    title: 'Opening remarks',
    desc: 'Welcome to Tech Derby Summit 2026',
  },
  {
    time: '09:45',
    title: 'Keynote: AI, Startups and the Next Digital Economy',
    desc: 'A practical view of the opportunity ahead',
    highlight: true,
  },
  {
    time: '10:30',
    title: 'Panel: AI for business growth and productivity',
    desc: 'How organisations are using AI responsibly',
  },
  {
    time: '11:15',
    title: 'Founder spotlight',
    desc: 'Stories from startup builders and ecosystem leaders',
  },
  {
    time: '12:00',
    title: 'Networking and partner showcase',
    desc: 'Meet founders, educators, employers and investors',
  },
];

const themes = [
  {
    title: 'AI for Practical Impact',
    desc: 'Exploring how AI can create real value across business, work and society.',
    color: 'bg-slate-600',
  },
  {
    title: 'Startups and Entrepreneurship',
    desc: 'Spotlighting founders, venture growth and the support needed to build well.',
    color: 'bg-slate-600',
  },
  {
    title: 'Local Talent and Future Skills',
    desc: 'Connecting learners, emerging talent and employers to meaningful opportunities.',
    color: 'bg-slate-500',
  },
  {
    title: 'Responsible Innovation',
    desc: 'Championing leadership, trust, governance and inclusion in digital change.',
    color: 'bg-slate-500',
  },
];

const attendees = [
  'Startup founders and aspiring entrepreneurs',
  'Professionals in tech, product, digital and data',
  'Students, graduates and career changers',
  'Universities, educators and training providers',
  'Employers, partners, funders and ecosystem supporters',
  'Community leaders interested in access and inclusion',
];

const outcomes = [
  'That Derby has talent and ambition.',
  'That this summit is credible, modern and worth attending.',
  'That the event is part of a wider regional movement through East Mids Tech Week.',
  'That Tech Derby is convening community, innovation and opportunity in one place.',
];

const speakers = [
  { initials: 'KS', role: 'Keynote Speaker', area: 'AI, innovation and business leadership' },
  { initials: 'FS', role: 'Founder Speaker', area: 'Startup growth and venture building' },
  { initials: 'EL', role: 'Ecosystem Leader', area: 'Regional collaboration and future skills' },
];

const stats = [
  { label: 'Event date', value: '15 June 2026' },
  { label: 'Location', value: 'Derby' },
  { label: 'Core focus', value: 'Founders / AI' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function TechDerbySummitPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby Summit 2026 | AI, Startups and the Next Digital Economy"
        description="A bold regional gathering for founders, professionals, students, educators, employers and ecosystem leaders shaping Derby's digital future. 15 June 2026, Derby."
      />

      {/* Full page background: dark navy fading to teal at bottom */}
      <div
        className="min-h-screen"
        style={{
          background: 'linear-gradient(180deg, #0d1b2e 0%, #0d1b2e 40%, #0e2a35 65%, #0a3340 80%, #0b3d45 100%)',
        }}
      >

        {/* ── HERO ── */}
        <section
          id="about"
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #10213a 0%, #0d1b2e 100%)',
          }}
        >
          {/* Radial glows */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-5%] top-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.18),transparent_65%)]" />
            <div className="absolute right-[5%] top-[5%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.22),transparent_65%)]" />
            <div className="absolute bottom-[-10%] left-[30%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.12),transparent_65%)]" />
          </div>

          <Container className="relative z-10 pb-16 pt-14 md:pb-20 md:pt-20">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-[#112233] px-4 py-2 text-[11px] font-semibold text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Part of East Mids Tech Week 2026
              </span>
            </div>

            {/* Title */}
            <h1 className="max-w-2xl text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl">
              Tech Derby Summit 2026
            </h1>

            {/* Subtitle */}
            <p className="mt-3 text-xl font-semibold text-cyan-400 md:text-2xl">
              AI, Startups and the Next Digital Economy
            </p>

            {/* Description */}
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 md:text-base">
              A bold regional gathering for founders, professionals, students, educators,
              employers and ecosystem leaders shaping Derby's digital future.
            </p>

            {/* CTA buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/events/browse">
                <Button
                  className="h-11 rounded-lg bg-cyan-500 px-6 text-sm font-bold text-slate-950 shadow-lg hover:bg-cyan-400"
                >
                  Register for the Summit
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="ghost"
                  className="h-11 rounded-lg border border-white/25 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Become a Partner
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-white/[4%] px-5 py-3 backdrop-blur-sm"
                >
                  <p className="text-sm font-bold text-white">{s.value}</p>
                  <p className="mt-0.5 text-[11px] text-white/45">{s.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── CONFERENCE THEME FEATURE ── */}
        <section className="relative overflow-hidden py-14 md:py-20">
          {/* Orange glow behind */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[5%] top-[20%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.14),transparent_60%)]" />
          </div>
          <Container className="relative z-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">

              {/* Circular photo */}
              <div className="flex justify-center lg:justify-start">
                <div
                  className="relative h-72 w-72 overflow-hidden rounded-full md:h-[340px] md:w-[340px]"
                  style={{
                    background: 'linear-gradient(135deg, #1e3a4a 0%, #243346 50%, #1a2d3e 100%)',
                    boxShadow: '0 0 60px rgba(249,115,22,0.2), 0 0 0 1px rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-center text-sm text-white/30">Event photo</p>
                  </div>
                </div>
              </div>

              {/* Info cards stacked */}
              <div className="flex flex-col gap-3">
                {/* Conference Theme card */}
                <div
                  className="rounded-2xl border border-white/8 p-5"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Conference Theme
                  </p>
                  <h2 className="mt-2 text-lg font-black text-white md:text-xl">
                    AI, Startups and the Next<br />Digital Economy
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    Practical conversations on innovation, local talent, responsible leadership
                    and regional growth.
                  </p>
                </div>

                {/* Featured session card */}
                <div
                  className="rounded-2xl border border-white/8 p-5"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                        Featured session
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">
                        AI for Business Growth and Productivity
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-300">
                      Live panel
                    </span>
                  </div>
                </div>

                {/* Audience + Experience */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-2xl border border-white/8 p-4"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                      Audience
                    </p>
                    <p className="mt-1.5 text-sm font-semibold leading-snug text-white">
                      Founders, students, employers and ecosystem partners
                    </p>
                  </div>
                  <div
                    className="rounded-2xl border border-white/8 p-4"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                      Experience
                    </p>
                    <p className="mt-1.5 text-sm font-semibold leading-snug text-white">
                      Keynotes, panels, networking and collaboration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── ABOUT THE SUMMIT ── */}
        <section
          id="about-summit"
          className="relative py-14 md:py-20"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.04) 100%)',
          }}
        >
          <Container>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              About the Summit
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-4xl">
              A conference rooted in Derby,<br />connected to the wider East Midlands
            </h2>

            {/* Body text card */}
            <div
              className="mt-6 rounded-2xl border border-white/8 p-5 md:p-6"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <p className="text-sm leading-relaxed text-white/65 md:text-base">
                Tech Derby Summit 2026 is a meeting point for ideas, ambition and practical
                action. It brings together those building startups, shaping talent, driving
                digital transformation and opening doors for others. As part of East Mids Tech
                Week, the summit places Derby within a wider regional story of innovation,
                connectivity and future-facing growth.
              </p>
            </div>

            {/* Theme 2×2 grid */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {themes.map((t) => (
                <div
                  key={t.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/8 p-5"
                  style={{ background: 'rgba(15,30,50,0.7)' }}
                >
                  <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${t.color}`} />
                  <div>
                    <p className="font-bold text-white">{t.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/55">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── AGENDA PREVIEW ── */}
        <section id="agenda" className="relative py-14 md:py-20">
          {/* Orange glow top-right */}
          <div className="pointer-events-none absolute right-[-5%] top-[10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.12),transparent_65%)]" />
          <Container className="relative z-10">
            {/* Header row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Agenda Preview
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                  A day of insight, connection and momentum
                </h2>
              </div>
              <button className="mt-1 rounded-xl border border-white/20 bg-white/[4%] px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10">
                View full agenda
              </button>
            </div>

            {/* Timeline card */}
            <div
              className="mt-8 overflow-hidden rounded-2xl border border-white/10"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {agendaItems.map((item, i) => (
                <div
                  key={item.time}
                  className={`flex items-start gap-6 px-6 py-5 ${
                    i < agendaItems.length - 1 ? 'border-b border-white/[6%]' : ''
                  }`}
                  style={
                    item.highlight
                      ? { background: 'rgba(249,115,22,0.06)' }
                      : undefined
                  }
                >
                  <span className="w-12 shrink-0 text-sm font-black text-cyan-400">
                    {item.time}
                  </span>
                  <div>
                    <p
                      className={`font-bold text-white ${
                        item.highlight ? 'text-base' : 'text-sm'
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`mt-0.5 text-sm ${
                        item.highlight ? 'text-amber-300/60' : 'text-white/45'
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── WHO SHOULD ATTEND ── */}
        <section className="relative py-14 md:py-20">
          {/* Subtle right glow */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_80%_50%,rgba(6,182,212,0.08),transparent_60%)]" />
          <Container className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Who Should Attend
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-4xl">
              Built for builders, learners,<br />partners and leaders
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {/* Attendee pill list */}
              <div
                className="rounded-2xl border border-white/8 p-5 md:p-6"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <ul className="flex flex-col gap-2.5">
                  {attendees.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[3%] px-4 py-2.5"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                      <span className="text-sm text-white/80">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Conference outcomes */}
              <div
                className="rounded-2xl border border-white/8 p-5 md:p-6"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Conference Outcomes
                </p>
                <h3 className="mt-3 text-xl font-black leading-snug text-white">
                  What this page should<br />make visitors feel
                </h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {outcomes.map((o) => (
                    <li key={o} className="text-sm leading-relaxed text-cyan-200/65">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* ── SPEAKERS ── */}
        <section id="speakers" className="relative py-14 md:py-20">
          <div className="pointer-events-none absolute left-[10%] top-[20%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.10),transparent_65%)]" />
          <Container className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Speakers
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Featured voices and future-facing conversations
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {speakers.map((s) => (
                <div
                  key={s.initials}
                  className="rounded-2xl border border-white/10 p-6"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {/* Cyan gradient avatar */}
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}
                  >
                    {s.initials}
                  </div>
                  <p className="mt-5 text-base font-bold text-white">{s.role}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{s.area}</p>
                  <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400/80">
                    Photo + Bio Placeholder
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── PARTNERS & SPONSORS ── */}
        <section id="partners" className="relative py-14 md:py-20">
          <Container>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Partners and Sponsors
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
              Support the summit. Shape the ecosystem.
            </h2>

            <div
              className="mt-8 overflow-hidden rounded-2xl border border-white/10"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <div className="grid md:grid-cols-2">
                {/* Left */}
                <div className="p-6 md:p-8">
                  <p className="max-w-sm text-sm leading-relaxed text-white/65">
                    Align your organisation with a growing regional platform focused on
                    founders, digital talent, responsible innovation and long-term ecosystem
                    building.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/contact">
                      <Button className="h-10 rounded-lg bg-cyan-500 px-5 text-sm font-bold text-slate-950 hover:bg-cyan-400">
                        Become a Partner
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button
                        variant="ghost"
                        className="h-10 rounded-lg border border-white/25 bg-transparent px-5 text-sm font-semibold text-white hover:bg-white/10"
                      >
                        Sponsorship Pack
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right: 2×2 logo placeholders */}
                <div className="border-t border-white/[6%] p-6 md:border-l md:border-t-0 md:p-8">
                  <div className="grid grid-cols-2 gap-3">
                    {['Partner logo', 'Sponsor logo', 'University', 'Community'].map((label) => (
                      <div
                        key={label}
                        className="flex h-20 items-center justify-center rounded-xl border border-white/10"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <span className="text-xs font-medium text-white/30">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── FINAL CTA ── */}
        <section
          className="relative overflow-hidden py-16 md:py-24"
          style={{
            background: 'linear-gradient(180deg, #0b3d45 0%, #0d4a52 50%, #0e5560 100%)',
          }}
        >
          {/* Top cyan glow */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-[-60px] h-[240px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.18),transparent_65%)]" />

          <Container className="relative z-10">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              {/* Text left */}
              <div className="max-w-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Final Call to Action
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
                  Join the conversation shaping Derby's next digital chapter
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
                  Come to learn, connect and contribute. Be part of a summit that gathers
                  the people, ideas and partnerships shaping the next digital economy.
                </p>
              </div>

              {/* Buttons stacked right */}
              <div className="flex shrink-0 flex-col gap-3">
                <Link to="/events/browse">
                  <Button className="h-12 w-full rounded-lg bg-cyan-500 px-8 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-900/40 hover:bg-cyan-400 md:w-auto">
                    Register Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    className="h-12 w-full rounded-lg border border-white/25 bg-transparent px-8 text-sm font-semibold text-cyan-300 hover:bg-white/10 md:w-auto"
                  >
                    Partnership
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

      </div>
    </>
  );
}


const agendaItems = [
  {
    time: '09:00',
    title: 'Arrival, registration and networking',
    desc: 'Coffee, welcome desk and partner conversations',
  },
  {
    time: '09:30',
    title: 'Opening remarks',
    desc: 'Welcome to Tech Derby Summit 2026',
  },
  {
    time: '09:45',
    title: 'Keynote: AI, Startups and the Next Digital Economy',
    desc: 'A practical view of the opportunity ahead',
    highlight: true,
  },
  {
    time: '10:30',
    title: 'Panel: AI for business growth and productivity',
    desc: 'How organisations are using AI responsibly',
  },
  {
    time: '11:15',
    title: 'Founder spotlight',
    desc: 'Stories from startup builders and ecosystem leaders',
  },
  {
    time: '12:00',
    title: 'Networking and partner showcase',
    desc: 'Meet founders, educators, employers and investors',
  },
];

const themes = [
  {
    title: 'AI for Practical Impact',
    desc: 'Exploring how AI can create real value across business, work and society.',
    dot: 'bg-cyan-400',
  },
  {
    title: 'Startups and Entrepreneurship',
    desc: 'Spotlighting founders, venture growth and the support needed to build well.',
    dot: 'bg-blue-400',
  },
  {
    title: 'Local Talent and Future Skills',
    desc: 'Connecting learners, emerging talent and employers to meaningful opportunities.',
    dot: 'bg-teal-400',
  },
  {
    title: 'Responsible Innovation',
    desc: 'Championing leadership, trust, governance and inclusion in digital change.',
    dot: 'bg-indigo-400',
  },
];

const attendees = [
  'Startup founders and aspiring entrepreneurs',
  'Professionals in tech, product, digital and data',
  'Students, graduates and career changers',
  'Universities, educators and training providers',
  'Employers, partners, funders and ecosystem supporters',
  'Community leaders interested in access and inclusion',
];

const outcomes = [
  'That Derby has talent and ambition.',
  'That this summit is credible, modern and worth attending.',
  'That the event is part of a wider regional movement through East Mids Tech Week.',
  'That Tech Derby is convening community, innovation and opportunity in one place.',
];

const speakers = [
  {
    initials: 'KS',
    role: 'Keynote Speaker',
    area: 'AI, innovation and business leadership',
  },
  {
    initials: 'FS',
    role: 'Founder Speaker',
    area: 'Startup growth and venture building',
  },
  {
    initials: 'EL',
    role: 'Ecosystem Leader',
    area: 'Regional collaboration and future skills',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function TechDerbySummitPage() {
  return (
    <>
      <PageSeo
        title="Tech Derby Summit 2026 | AI, Startups and the Next Digital Economy"
        description="A bold regional gathering for founders, professionals, students, educators, employers and ecosystem leaders shaping Derby's digital future. 15 June 2026, Derby."
      />

      {/* ── PAGE WRAPPER with gradient ── */}
      <div className="bg-[#060c18]">

        {/* ── HERO ── */}
        <section id="about" className="relative overflow-hidden py-0">
          {/* Background layers */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_40%,rgba(6,182,212,0.22),transparent_52%),radial-gradient(ellipse_at_78%_25%,rgba(37,99,235,0.28),transparent_50%),radial-gradient(ellipse_at_55%_80%,rgba(249,115,22,0.18),transparent_45%)]" />
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
            />
          </div>

          <Container className="relative z-10 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              {/* East Mids Tech Week badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Part of East Mids Tech Week 2026
              </span>

              <h1 className="mt-6 text-5xl font-black leading-[1.06] tracking-tight text-white sm:text-6xl md:text-7xl">
                Tech Derby Summit 2026
              </h1>

              <p className="mt-3 text-xl font-semibold text-cyan-300 md:text-2xl">
                AI, Startups and the Next Digital Economy
              </p>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
                A bold regional gathering for founders, professionals, students, educators,
                employers and ecosystem leaders shaping Derby's digital future.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/events/browse">
                  <Button className="h-12 rounded-full bg-cyan-500 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-900/40 hover:bg-cyan-400">
                    Register for the Summit
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Become a Partner
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {[
                  { label: 'Event date', value: '15 June 2026' },
                  { label: 'Location', value: 'Derby' },
                  { label: 'Core focus', value: 'Founders / AI' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="min-w-[130px] rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-left backdrop-blur-sm"
                  >
                    <p className="text-base font-bold text-white">{stat.value}</p>
                    <p className="mt-0.5 text-xs text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── CONFERENCE THEME FEATURE ── */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(249,115,22,0.14),transparent_55%)]" />
          <Container className="relative">
            <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">

              {/* Circular image */}
              <div className="flex justify-center">
                <div className="relative h-72 w-72 overflow-hidden rounded-full border border-white/10 shadow-2xl shadow-cyan-900/30 md:h-96 md:w-96">
                  <div className="h-full w-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-center text-sm font-medium text-white/40">Event photo</p>
                  </div>
                </div>
              </div>

              {/* Info cards */}
              <div className="flex flex-col gap-4">
                {/* Theme card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Conference Theme
                  </p>
                  <h2 className="mt-2 text-xl font-black text-white md:text-2xl">
                    AI, Startups and the Next Digital Economy
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Practical conversations on innovation, local talent, responsible leadership
                    and regional growth.
                  </p>
                </div>

                {/* Featured session card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        Featured session
                      </p>
                      <p className="mt-1 text-base font-bold text-white">
                        AI for Business Growth and Productivity
                      </p>
                    </div>
                    <span className="mt-0.5 shrink-0 rounded-full bg-cyan-400/15 px-3 py-1 text-[11px] font-bold text-cyan-300">
                      Live panel
                    </span>
                  </div>
                </div>

                {/* Audience / Experience */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                      Audience
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Founders, students, employers and ecosystem partners
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                      Experience
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Keynotes, panels, networking and collaboration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── ABOUT ── */}
        <section className="relative py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-5xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                About the Summit
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">
                A conference rooted in Derby, connected to the wider East Midlands
              </h2>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-sm leading-relaxed text-white/70 md:text-base">
                  Tech Derby Summit 2026 is a meeting point for ideas, ambition and practical
                  action. It brings together those building startups, shaping talent, driving
                  digital transformation and opening doors for others. As part of East Mids Tech
                  Week, the summit places Derby within a wider regional story of innovation,
                  connectivity and future-facing growth.
                </p>
              </div>

              {/* Theme cards 2×2 */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {themes.map((theme) => (
                  <div
                    key={theme.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${theme.dot}`} />
                    <div>
                      <p className="font-bold text-white">{theme.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{theme.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── AGENDA ── */}
        <section id="agenda" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(249,115,22,0.12),transparent_55%)]" />
          <Container className="relative">
            <div className="mx-auto max-w-5xl">
              {/* Kicker + view all in same row */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Agenda Preview
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
                    A day of insight, connection and momentum
                  </h2>
                </div>
                <button className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10">
                  View full agenda
                </button>
              </div>

              {/* Timeline */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                {agendaItems.map((item, i) => (
                  <div
                    key={item.time}
                    className={`flex items-start gap-5 px-6 py-5 ${
                      i < agendaItems.length - 1 ? 'border-b border-white/8' : ''
                    } ${item.highlight ? 'bg-white/[3%]' : ''}`}
                  >
                    <span className="w-14 shrink-0 text-base font-black text-cyan-400">
                      {item.time}
                    </span>
                    <div>
                      <p className={`font-bold text-white ${item.highlight ? 'text-base' : 'text-sm'}`}>
                        {item.title}
                      </p>
                      <p className={`mt-0.5 text-sm ${item.highlight ? 'text-cyan-200/70' : 'text-white/50'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── WHO SHOULD ATTEND ── */}
        <section className="relative py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-5xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Who Should Attend
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white md:text-4xl">
                Built for builders, learners, partners and leaders
              </h2>

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {/* Attendee list */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <ul className="space-y-3">
                    {attendees.map((a) => (
                      <li key={a} className="flex items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                        <span className="text-sm text-white/80">{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conference outcomes */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                    Conference Outcomes
                  </p>
                  <h3 className="mt-2 text-xl font-black text-white">
                    What this summit should make visitors feel
                  </h3>
                  <ul className="mt-5 space-y-4">
                    {outcomes.map((o) => (
                      <li key={o} className="text-sm leading-relaxed text-cyan-200/70">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── SPEAKERS ── */}
        <section id="speakers" className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(249,115,22,0.12),transparent_55%)]" />
          <Container className="relative">
            <div className="mx-auto max-w-5xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Speakers
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                Featured voices and future-facing conversations
              </h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {speakers.map((s) => (
                  <div
                    key={s.initials}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                  >
                    {/* Avatar */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-black text-white shadow-lg shadow-cyan-900/40">
                      {s.initials}
                    </div>
                    <p className="mt-4 text-base font-bold text-white">{s.role}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{s.area}</p>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-400/70">
                      Photo + Bio Placeholder
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── PARTNERS & SPONSORS ── */}
        <section id="partners" className="relative py-16 md:py-24">
          <Container>
            <div className="mx-auto max-w-5xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Partners and Sponsors
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                Support the summit. Shape the ecosystem.
              </h2>

              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="grid gap-0 md:grid-cols-2">
                  {/* Left: description + buttons */}
                  <div className="p-6 md:p-8">
                    <p className="text-sm leading-relaxed text-white/70">
                      Align your organisation with a growing regional platform focused on
                      founders, digital talent, responsible innovation and long-term ecosystem
                      building.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link to="/contact">
                        <Button className="h-10 rounded-full bg-cyan-500 px-6 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                          Become a Partner
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button
                          variant="ghost"
                          className="h-10 rounded-full border border-white/30 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10"
                        >
                          Sponsorship Pack
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Right: logo placeholder grid */}
                  <div className="border-t border-white/8 p-6 md:border-l md:border-t-0 md:p-8">
                    <div className="grid grid-cols-2 gap-3">
                      {['Partner logo', 'Sponsor logo', 'University', 'Community'].map(
                        (label) => (
                          <div
                            key={label}
                            className="flex h-20 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                          >
                            <span className="text-xs font-medium text-white/35">{label}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          {/* Transition to teal gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060c18] via-[#062a2e] to-[#083d3f]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.25),transparent_60%)]" />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                Final Call to Action
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
                Join the conversation shaping Derby's next digital chapter
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65">
                Come to learn, connect and contribute. Be part of a summit that gathers the
                people, ideas and partnerships shaping the next digital economy.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/events/browse">
                  <Button className="h-12 rounded-full bg-cyan-500 px-8 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-900/40 hover:bg-cyan-400">
                    Register Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="ghost"
                    className="h-12 rounded-full border border-white/30 bg-transparent px-8 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    Partnership
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

      </div>
    </>
  );
}
