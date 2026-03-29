import { useState } from 'react';
import { Search, Filter, MapPin, Briefcase } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export function MemberDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');

  const skills = ['all', 'JavaScript', 'React', 'Python', 'DevOps', 'Design', 'Product'];

  const members = [
    { name: 'Sarah Johnson', title: 'Senior Developer', company: 'Rolls-Royce', location: 'Derby', skills: ['JavaScript', 'React'] },
    { name: 'Michael Chen', title: 'UX Designer', company: 'Startup Co', location: 'Derby', skills: ['Design', 'Product'] },
    { name: 'Emma Williams', title: 'DevOps Engineer', company: 'Tech Firm', location: 'Nottingham', skills: ['DevOps', 'Python'] },
    { name: 'James Taylor', title: 'Product Manager', company: 'SaaS Company', location: 'Derby', skills: ['Product'] },
    { name: 'Lisa Anderson', title: 'Frontend Developer', company: 'Agency', location: 'Derby', skills: ['JavaScript', 'React'] },
    { name: 'David Brown', title: 'Backend Developer', company: 'Enterprise', location: 'Leicester', skills: ['Python', 'DevOps'] },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = selectedSkill === 'all' || member.skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Member Directory
        </h1>
        <p className="text-gray-600">
          Connect with {members.length} members of the Tech Derby community
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {skills.map((skill) => (
              <Button
                key={skill}
                variant={selectedSkill === skill ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSkill(skill)}
                className="whitespace-nowrap"
              >
                {skill === 'all' ? 'All Skills' : skill}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
        </p>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.name} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {member.name}
            </h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{member.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{member.location}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {member.skills.map((skill) => (
                <span key={skill} className="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-600 mb-4">No members found matching your criteria</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedSkill('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
