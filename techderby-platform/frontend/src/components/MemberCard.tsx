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
    </Card>
  );
}
