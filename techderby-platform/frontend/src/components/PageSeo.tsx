import { Helmet } from 'react-helmet-async';

interface PageSeoProps {
  title: string;
  description: string;
  keywords?: string;
}

export function PageSeo({ title, description, keywords }: PageSeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
