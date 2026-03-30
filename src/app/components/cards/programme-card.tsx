import { Link } from 'react-router';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ProgrammeCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function ProgrammeCard({ title, description, href, icon: Icon }: ProgrammeCardProps) {
  return (
    <Link
      to={href}
      className="bg-card border border-border p-8 rounded-lg hover:shadow-lg hover:border-primary/30 transition-all group block"
    >
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/90 transition-all">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      <span className="text-sm font-medium text-primary flex items-center">
        Learn more
        <ArrowRight className="ml-2 w-4 h-4" />
      </span>
    </Link>
  );
}
