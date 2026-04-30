import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';

export default function AdminPage() {
  return (
    <Section>
      <PageSeo title="Tech Derby | Admin" description="Admin console placeholder for platform operations." />
      <Container>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="mt-3 text-slate-700">Use Strapi Admin at http://localhost:1337/admin for content management.</p>
      </Container>
    </Section>
  );
}
