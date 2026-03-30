import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Container } from './ui/Container';
import { Section } from './ui/Section';
import { WaterRippleContainer } from './WaterRipple';

export function Hero() {
  return (
    <Section className="relative min-h-[620px] overflow-hidden bg-slate-900 py-0">
      <WaterRippleContainer className="min-h-[620px]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.35),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(249,115,22,0.28),transparent_38%)]" />
        </div>

        <Container className="relative z-10 flex min-h-[620px] items-center py-24 text-center md:text-left">
        <div className="mx-auto max-w-4xl md:mx-0">
          <p className="text-sm uppercase tracking-[0.18em] text-white/85">The Network Powering Derby's Digital Economy</p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Tech Derby: Derby's Thriving Tech Community
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/90 md:mx-0 md:text-xl">
            Empowering developers, designers, data experts, founders, and future talent across Derby and the Midlands.
            We connect people, open doors, and help great ideas grow together.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Link to="/get-involved">
              <Button className="w-full sm:w-auto">Join the community</Button>
            </Link>
            <Link to="/partners">
              <Button
                variant="ghost"
                className="w-full border border-white/70 bg-transparent text-white hover:bg-white hover:text-slate-900 sm:w-auto"
              >
                Partner with us
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left text-white/85 md:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-white">2,500+</p>
              <p className="text-xs uppercase tracking-wide">Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">150+</p>
              <p className="text-xs uppercase tracking-wide">Events/Year</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">80+</p>
              <p className="text-xs uppercase tracking-wide">Partners</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">10+</p>
              <p className="text-xs uppercase tracking-wide">Years</p>
            </div>
          </div>
        </div>
      </Container>
      </WaterRippleContainer>
    </Section>
  );
}
