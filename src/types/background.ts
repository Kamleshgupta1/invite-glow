export interface BackgroundSettings {
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
}

export interface EmojiItem {
  emoji: string;
  position: { x: number; y: number };
  size: number;
  animation: string;
}