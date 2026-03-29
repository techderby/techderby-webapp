import { Link } from 'react-router';
import { Linkedin } from 'lucide-react';

interface MemberCardProps {
  id: string;
  name: string;
  role: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  linkedinUrl?: string;
  avatarUrl?: string;
}

export function MemberCard({
  id,
  name,
  role,
  bio,
  skills = [],
  interests = [],
  linkedinUrl,
  avatarUrl,
}: MemberCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary/30 transition-all">
      {/* Avatar */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-bold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {bio}
        </p>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md">
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Interests</p>
          <div className="flex flex-wrap gap-2">
            {interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-md"
              >
                {interest}
              </span>
            ))}
            {interests.length > 3 && (
              <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md">
                +{interests.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
