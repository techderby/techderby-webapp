import { Link } from 'react-router';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../ui/button';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees?: number;
  summary?: string;
  theme?: string;
  imageUrl?: string;
}

export function EventCard({
  id,
  title,
  date,
  time,
  location,
  attendees,
  summary,
  theme,
  imageUrl,
}: EventCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group">
      {/* Event Image */}
      <div className="relative bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Calendar className="w-12 h-12 text-gray-400" />
        )}
        {theme && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
              {theme}
            </span>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {summary && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {summary}
          </p>
        )}

        {/* Event Meta */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{date} • {time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          {attendees && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">{attendees} attending</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link to={`/events/${id}`}>
          <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-white hover:border-primary">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
