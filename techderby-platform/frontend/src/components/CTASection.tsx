import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Container } from './ui/Container';
import { Section } from './ui/Section';

export function CTASection() {
  return (
    <>
      <Section className="bg-slate-900 py-16 text-white md:py-20">
        <Container>
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-[52px]">
              Ready to Join Derby's Tech Community?
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-base text-white/85 md:text-lg">
              Connect with thousands of tech professionals, attend events, and help shape the future of
              technology in the East Midlands.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/login">
                <Button variant="secondary" className="h-10 w-full px-6 text-sm sm:w-auto">
                  Join Tech Derby
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="ghost"
                  className="h-10 w-full border border-white/30 px-6 text-sm text-white hover:bg-white hover:text-slate-900 sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
      <div className="h-8 bg-white md:h-10" aria-hidden="true" />
    </>
  );
}
