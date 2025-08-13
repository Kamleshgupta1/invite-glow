import { BorderSettings } from '@/types/background';

export interface EventType {
  value: string;
  label: string;
  emoji: string;
  defaultMessage: string;
  theme: string;
  backgroundImage?: string;
  category: 'birthday' | 'religious' | 'national' | 'seasonal' | 'personal' | 'custom';
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  animation: string;
  priority: number;
}

export interface TextContent {
  id: string;
  content: string;
  style: {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
  animation: string;
}

export interface GreetingFormData {
  eventType: string;
  customEventName?: string;
  senderName: string;
  receiverName: string;
  texts: TextContent[];
  media: MediaItem[];
  videoUrl: string;
  videoPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  audioUrl: string;
  animationStyle: string;
  layout: 'grid' | 'masonry' | 'carousel' | 'stack' | 'collage';
  theme: string;
  backgroundSettings: {
    color: string;
    gradient: {
      enabled: boolean;
      colors: [string, string];
      direction: string;
    };
    animation: {
      enabled: boolean;
      type: string;
      speed: number;
      intensity: number;
    };
    pattern: {
      enabled: boolean;
      type: string;
      opacity: number;
    };
  };
  emojis: {
    id: string;
    emoji: string;
    position: { x: number; y: number };
    size: number;
    animation: string;
  }[];
  borderSettings: BorderSettings;
}