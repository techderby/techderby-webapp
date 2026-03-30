import { ExternalLink } from 'lucide-react';

interface PartnerCardProps {
  name: string;
  category: string;
  description: string;
  contribution?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export function PartnerCard({
  name,
  category,
  description,
  contribution,
  logoUrl,
  websiteUrl,
}: PartnerCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/30 transition-all h-full flex flex-col">
      {/* Partner Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className="h-12 object-contain mb-3"
            />
          ) : (
            <div className="h-12 bg-muted rounded flex items-center justify-center mb-3 px-4">
              <span className="text-sm font-medium text-muted-foreground">{name}</span>
            </div>
          )}
          <span className="inline-block text-xs px-2 py-1 bg-accent/10 text-accent rounded-md">
            {category}
          </span>
        </div>
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={`Visit ${name} website`}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 flex-1">
        {description}
      </p>

      {/* Contribution */}
      {contribution && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-1">Support Contribution</p>
          <p className="text-sm text-foreground">{contribution}</p>
        </div>
      )}
    </div>
  );
}
