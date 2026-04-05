import type { Member } from '../types/content';
import { Card } from './ui/Card';
import { Tag } from './ui/Tag';

export function MemberCard({ member }: { member: Member }) {
  return (
    <Card>
      <h3 className="text-lg font-bold">{member.name}</h3>
      <p className="text-sm text-slate-600">{member.role}</p>
      <p className="mt-3 text-sm text-slate-700">{member.bio}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {member.skills.slice(0, 3).map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </div>
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name}'s LinkedIn profile (opens in a new tab)`}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
        >
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>
      )}
    </Card>
  );
}
