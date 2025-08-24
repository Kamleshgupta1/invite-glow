import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventTypes } from '@/data/eventTypes';

interface EventTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EventTypeSelector = ({ value, onChange }: EventTypeSelectorProps) => {
  const categories = eventTypes.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {} as Record<string, typeof eventTypes>);

  const categoryLabels = {
    birthday: '🎂 Birthday Events',
    religious: '🕉️ Religious Festivals',
    national: '🇮🇳 National Holidays',
    seasonal: '🌸 Seasonal Festivals',
    personal: '💝 Personal Milestones',
    custom: '✨ Custom Events'
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="eventType">Event Type *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose an event type" />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {Object.entries(categories).map(([category, events]) => (
            <div key={category}>
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </div>
              {events.map((event) => (
                <SelectItem key={event.value} value={event.value}>
                  {event.emoji} {event.label}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventTypeSelector;