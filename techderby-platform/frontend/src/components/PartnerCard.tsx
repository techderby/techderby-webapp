import type { Partner } from '../types/content';
import { Card } from './ui/Card';
import { Tag } from './ui/Tag';

function normalizePartnerCategory(partner: { name: string; partnerType?: string; category?: string }) {
  const rawCategory = (partner.partnerType ?? partner.category ?? '').toLowerCase().trim();
  const nameLooksUniversity = /\buniversity\b|\bcollege\b/i.test(partner.name);

  if (nameLooksUniversity) return 'universities';

  const normalized = rawCategory;
  if (normalized === 'education' || normalized === 'universities') return 'universities';
  if (normalized === 'sponsor' || normalized === 'employers') return 'employers';
  if (normalized === 'core' || normalized === 'startups') return 'startups';
  if (normalized === 'ecosystem') return 'ecosystem';
  return 'community';
}

const categoryLabel: Record<string, string> = {
  universities: 'Universities',
  employers: 'Employers and recruiters',
  startups: 'Startups and founders',
  community: 'Community and third sector',
  ecosystem: 'Ecosystem partners',
};

const categorySupportText: Record<string, string> = {
  universities: 'Supports skills pathways, student access, and practical startup community spaces.',
  employers: 'Supports community events, speakers, hiring opportunities, and career pathways in Derby.',
  community: 'Supports inclusive networking and local ecosystem collaboration.',
  startups: 'Supports founder learning, peer exchange, and long-term platform growth.',
  ecosystem: 'Supports incubator, accelerator, and network collaboration across the region.',
};

function normalizeWebsite(url?: string) {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function resolveLogoUrl(logo?: string) {
  if (!logo) return undefined;
  if (/^https?:\/\//i.test(logo)) return logo;

  const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:1337';
  return `${baseUrl.replace(/\/$/, '')}${logo.startsWith('/') ? '' : '/'}${logo}`;
}

export function PartnerCard({ partner }: { partner: Partner }) {
  const websiteUrl = normalizeWebsite(partner.website);
  const logoUrl = resolveLogoUrl(partner.logo);
  const partnerCategory = normalizePartnerCategory(partner);
  const supportSentence = categorySupportText[partnerCategory] ?? 'Supports the Tech Derby community through collaboration and opportunity.';
  const partnerCategoryLabel = categoryLabel[partnerCategory] ?? partnerCategory;
  const ctaLabel = websiteUrl?.toLowerCase().includes('jobs') ? 'View open roles' : 'Visit website';

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={`${partner.name} logo`} className="h-10 w-10 rounded-md border border-slate-200 object-cover" />
          ) : (
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-sm font-bold text-slate-700">
              {partner.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-900">{partner.name}</h3>
            <Tag>{partnerCategoryLabel}</Tag>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-700">
        <span className="font-semibold text-slate-900">What they do:</span> {partner.description}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        <span className="font-semibold text-slate-900">How they support Tech Derby:</span> {supportSentence}
      </p>

      {websiteUrl ? (
        <a
          className="mt-4 inline-block text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-2"
          href={websiteUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Visit ${partner.name}`}
        >
          {ctaLabel}
        </a>
      ) : null}
    </Card>
  );
}
