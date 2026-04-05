import { Link } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import summitEventPhoto from '../assets/images/acc2.jpg';
import partnerLogo1 from '../assets/images/partners/partner1.png';
import partnerLogo2 from '../assets/images/partners/partner2.svg';

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────

const agendaItems = [
  { time: '09:00', title: 'Arrival, registration and networking',             desc: 'Coffee, welcome desk and partner conversations' },
  { time: '09:30', title: 'Opening remarks',                                  desc: 'Welcome to Tech Derby Summit 2026' },
  { time: '09:45', title: 'Keynote: AI, Startups and the Next Digital Economy', desc: 'A practical view of the opportunity ahead' },
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
        <section style={{ position: 'relative', overflow: 'hidden', padding: '52px 0 48px' }}>
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
              color: '#ffffff', fontSize: 'clamp(1.9rem, 4.8vw, 2.85rem)', maxWidth: '560px',
            }}>
              Tech Derby Summit 2026
            </h1>

            {/* Cyan subtitle */}
            <p style={{
              margin: '10px 0 0', fontWeight: 700, fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
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
              <a href="https://www.eventbrite.co.uk/e/east-mids-tech-week-2026-tech-derby-summit-2026-tickets-1986190909477?aff=oddtdtcreator" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{
                  height: '36px', padding: '0 18px', borderRadius: '999px',
                  background: '#06b6d4', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 700, color: '#0c1829',
                }}>
                  Register for the Summit
                </button>
              </a>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <button style={{
                  height: '36px', padding: '0 18px', borderRadius: '999px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.28)',
                  cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#ffffff',
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
                  borderRadius: '12px', padding: '9px 16px',
                }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#fff' }}>{s.value}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.42)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            CONFERENCE THEME
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '0' }}>
          {/* Full section background: event photo + dark overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${summitEventPhoto})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            filter: 'brightness(0.35)',
          }} />
          {/* Dark navy overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(10,20,40,0.55) 0%, rgba(8,18,35,0.72) 100%)',
          }} />
          {/* Large amber/orange radial glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '18%',
            transform: 'translate(-50%,-50%)',
            width: '700px', height: '700px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,146,60,0.38) 0%, rgba(249,115,22,0.18) 38%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '48px 24px',
            position: 'relative', zIndex: 1,
            display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'center',
          }}>

            {/* Circular photo — real image */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                width: '300px', height: '300px', borderRadius: '50%', flexShrink: 0,
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.10)',
                boxShadow: '0 0 0 10px rgba(255,255,255,0.04), 0 0 60px rgba(249,115,22,0.25)',
              }}>
                <img
                  src={summitEventPhoto}
                  alt="Tech Derby Summit event"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                />
              </div>
            </div>

            {/* Outer glass wrapper containing all cards */}
            <div style={{
              background: 'rgba(10,22,42,0.55)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {/* Conference Theme card */}
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '14px', padding: '18px 20px',
              }}>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
                  Conference Theme
                </p>
                <h2 style={{ margin: '8px 0 0', fontSize: '18px', fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                  AI, Startups and the Next<br />Digital Economy
                </h2>
                <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.65)' }}>
                  Practical conversations on innovation, local talent, responsible leadership and regional growth.
                </p>
              </div>

              {/* Featured session card */}
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '14px', padding: '16px 20px',
              }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                  AI for Business Growth and Productivity
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.40)' }}>
                    Featured session
                  </p>
                  <span style={{
                    background: '#06b6d4',
                    borderRadius: '999px', padding: '3px 12px',
                    fontSize: '11px', fontWeight: 700, color: '#0c1829',
                  }}>
                    Live panel
                  </span>
                </div>
              </div>

              {/* Audience + Experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Audience',   text: 'Founders, students, employers and ecosystem partners' },
                  { label: 'Experience', text: 'Keynotes, panels, networking and collaboration' },
                ].map((c) => (
                  <div key={c.label} style={{
                    background: 'rgba(255,255,255,0.055)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '12px', padding: '14px 16px',
                  }}>
                    <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.40)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                      {c.label}
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
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
        <section style={{ position: 'relative', padding: '46px 0 36px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-54px', right: '40px',
            width: '248px', height: '248px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.20) 0%, rgba(56,189,248,0.12) 42%, rgba(56,189,248,0.04) 66%, transparent 78%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '-152px', left: '45%',
            transform: 'translateX(-50%)',
            width: '376px', height: '780px',
            background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.32) 0%, rgba(249,115,22,0.14) 34%, rgba(56,189,248,0.08) 58%, transparent 80%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: '22px' }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
                Agenda Preview
              </p>
              <h2 style={{ margin: '9px 0 0', fontSize: 'clamp(2.25rem, 4.8vw, 3.45rem)', fontWeight: 900, color: '#fff', lineHeight: 1.08 }}>
                A day of insight, connection and momentum
              </h2>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '20px', overflow: 'hidden',
            }}>
              {agendaItems.map((item, i) => (
                <div key={item.time} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '24px',
                  padding: '14px 24px',
                  borderBottom: i < agendaItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <span style={{ width: '44px', flexShrink: 0, fontSize: '13px', fontWeight: 800, color: '#22d3ee' }}>
                    {item.time}
                  </span>
                  <div>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                      {item.title}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'rgba(230,236,245,0.38)' }}>
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
        <section style={{ position: 'relative', padding: '18px 0 76px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-300px', left: '45%',
            transform: 'translateX(-50%)',
            width: '388px', height: '790px',
            background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.24) 0%, rgba(249,115,22,0.09) 32%, rgba(56,189,248,0.08) 60%, transparent 82%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '196px', right: '62px',
            width: '338px', height: '338px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.20) 0%, rgba(56,189,248,0.10) 45%, transparent 74%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
              Who Should Attend
            </p>
            <h2 style={{ margin: '10px 0 20px', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.08 }}>
              Built for builders, learners,<br />partners and leaders
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch' }}>
              <div style={{
                background: 'linear-gradient(180deg, rgba(8,20,55,0.92) 0%, rgba(8,19,50,0.95) 100%)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '28px', padding: '20px',
              }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {attendees.map((a) => (
                    <li key={a} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      background: 'rgba(255,255,255,0.055)',
                      border: '1px solid rgba(255,255,255,0.11)',
                      borderRadius: '999px', padding: '8px 16px',
                    }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22d3ee', flexShrink: 0 }} />
                      <span style={{ fontSize: '12.5px', color: 'rgba(236,244,255,0.92)' }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(180deg, rgba(35,136,181,0.50) 0%, rgba(81,211,237,0.62) 100%)',
                border: '1px solid rgba(151,238,255,0.23)',
                borderRadius: '24px', padding: '20px 22px',
              }}>
                <div style={{
                  position: 'absolute', top: '-78px', right: '-74px',
                  width: '250px', height: '250px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(43,121,184,0.30) 0%, rgba(43,121,184,0.13) 45%, transparent 72%)',
                  pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
                  Conference Outcomes
                </p>
                <h3 style={{ margin: '10px 0 0', fontSize: 'clamp(2rem, 3.3vw, 2.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.08 }}>
                  What this page should<br />make visitors feel
                </h3>
                <div style={{ margin: '24px 0 0', display: 'flex', flexDirection: 'column', gap: '17px' }}>
                  {outcomes.map((o) => (
                    <p key={o} style={{ margin: 0, fontSize: '13px', lineHeight: 1.56, color: 'rgba(238,248,255,0.83)' }}>{o}</p>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            SPEAKERS
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: '54px 0 56px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-36px', right: '2%',
            width: '330px', height: '330px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(56,189,248,0.09) 44%, transparent 72%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '-180px', left: '48%',
            transform: 'translateX(-50%)',
            width: '360px', height: '760px',
            background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.28) 0%, rgba(249,115,22,0.10) 32%, rgba(56,189,248,0.07) 60%, transparent 82%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
              Speakers
            </p>
            <h2 style={{ margin: '10px 0 22px', fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.12 }}>
              Featured voices and future-facing conversations
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
              {speakers.map((s) => (
                <div key={s.initials} style={{
                  background: 'rgba(7,23,58,0.90)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '16px', padding: '20px',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg,#22d3ee,#3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 900, color: '#fff',
                  }}>
                    {s.initials}
                  </div>
                  <p style={{ margin: '14px 0 0', fontSize: 'clamp(1.5rem, 2.2vw, 2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.12 }}>{s.role}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', lineHeight: 1.5, color: 'rgba(210,223,240,0.62)' }}>{s.area}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            PARTNERS & SPONSORS
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', padding: '52px 0 54px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: '-120px', left: '46%',
            transform: 'translateX(-50%)',
            width: '360px', height: '700px',
            background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.28) 0%, rgba(249,115,22,0.10) 32%, rgba(56,189,248,0.08) 60%, transparent 82%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', top: '46px', right: '4%',
            width: '320px', height: '320px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0.08) 45%, transparent 74%)',
            pointerEvents: 'none',
          }} />
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#22d3ee' }}>
              Partners and Sponsors
            </p>
            <h2 style={{ margin: '10px 0 20px', fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.12 }}>
              Support the summit. Shape the ecosystem.
            </h2>

            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '24px', overflow: 'hidden',
              display: 'grid', gridTemplateColumns: '1fr 1fr',
            }}>
              {/* Left */}
              <div style={{ padding: '26px 32px' }}>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.65, color: 'rgba(255,255,255,0.60)', maxWidth: '320px' }}>
                  Align your organisation with a growing regional platform focused on founders,
                  digital talent, responsible innovation and long-term ecosystem building.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '22px', flexWrap: 'wrap' }}>
                  <Link to="/contact" style={{ textDecoration: 'none' }}>
                    <button style={{
                      height: '38px', padding: '0 20px', borderRadius: '999px',
                      background: '#06b6d4', border: 'none', cursor: 'pointer',
                      fontSize: '13px', fontWeight: 700, color: '#0c1829',
                    }}>
                      Become a Partner
                    </button>
                  </Link>

                </div>
              </div>

              {/* Right – logo grid */}
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    height: '64px', borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.11)',
                    padding: '10px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src={partnerLogo1} alt="Partner" style={{ maxHeight: '44px', maxWidth: '160px', objectFit: 'contain' }} />
                  </div>
                  <div style={{
                    height: '64px', borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.11)',
                    padding: '10px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src={partnerLogo2} alt="Partner" style={{ maxHeight: '44px', maxWidth: '160px', objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '22px 0 72px' }}>
          <div style={{
            maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
            position: 'relative', zIndex: 1,
          }}>
            <div style={{
              background: 'linear-gradient(145deg, rgba(35,136,181,0.70) 0%, rgba(81,211,237,0.78) 100%)',
              border: '1px solid rgba(151,238,255,0.25)',
              borderRadius: '24px',
              padding: '16px 20px',
              display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px',
            }}>
              <div style={{ maxWidth: '560px' }}>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#08314a' }}>
                  Final Call to Action
                </p>
                <h2 style={{ margin: '6px 0 0', fontSize: 'clamp(1.8rem, 3.4vw, 2.45rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>
                  Join the conversation shaping Derby's next digital chapter
                </h2>
                <p style={{ margin: '10px 0 0', fontSize: '12.5px', lineHeight: 1.58, color: 'rgba(8,39,58,0.84)' }}>
                  Come to learn, connect and contribute. Be part of a summit that gathers the
                  people, ideas and partnerships shaping the next digital economy.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '170px' }}>
                <a href="https://www.eventbrite.co.uk/e/east-mids-tech-week-2026-tech-derby-summit-2026-tickets-1986190909477?aff=oddtdtcreator" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', height: '38px', padding: '0 22px', borderRadius: '999px',
                    background: '#06b6d4', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 700, color: '#0c1829',
                  }}>
                    Register Now
                  </button>
                </a>
                <Link to="/contact" style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%', height: '38px', padding: '0 22px', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.20)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#ffffff',
                  }}>
                    Partnership
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
