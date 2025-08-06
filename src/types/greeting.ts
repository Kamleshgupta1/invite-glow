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
  content: string;
  position: {
    x: number;
    y: number;
  };
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
  customCSS: string;
  layout: 'grid' | 'masonry' | 'carousel' | 'stack' | 'collage';
  theme: string;
}