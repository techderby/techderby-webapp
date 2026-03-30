import { PageSeo } from '../components/PageSeo';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Input } from '../components/ui/Input';
import { Section } from '../components/ui/Section';

export default function LoginPage() {
  return (
    <Section>
      <PageSeo title="Tech Derby | Login" description="Log into Tech Derby admin or member account." />
      <Container className="max-w-md">
        <h1 className="text-3xl font-bold">Login</h1>
        <form className="mt-6 space-y-4" aria-label="Login form">
          <Input aria-label="Email" placeholder="Email" type="email" />
          <Input aria-label="Password" placeholder="Password" type="password" />
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </Container>
    </Section>
  );
}
