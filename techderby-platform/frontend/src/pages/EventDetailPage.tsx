import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PageSeo } from '../components/PageSeo';
import { Container } from '../components/ui/Container';
import { Section } from '../components/ui/Section';
import { useEvents } from '../hooks/use-content-query';

export default function EventDetailPage() {
  const { slug } = useParams();
  const { data } = useEvents();
  const event = useMemo(() => data?.find((item) => item.slug === slug), [data, slug]);

  if (!event) {
    return (
      <Section>
        <Container>
          <p>Event not found.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <PageSeo title={`Tech Derby | ${event.title}`} description={event.description} />
      <Container>
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="mt-4 text-slate-700">{event.description}</p>
        <p className="mt-4 text-sm text-slate-600">{event.date} at {event.venue}</p>
      </Container>
    </Section>
  );
}
