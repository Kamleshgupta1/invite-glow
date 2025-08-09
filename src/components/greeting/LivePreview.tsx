import React from 'react';
import { GreetingFormData } from '@/types/greeting';
import { eventTypes } from '@/data/eventTypes';
import { useLanguageTranslation } from '@/hooks/useLanguageTranslation';

interface LivePreviewProps {
  greetingData: GreetingFormData;
  showVisualEditor?: boolean;
}

const LivePreview = ({ greetingData, showVisualEditor = false }: LivePreviewProps) => {
  const { translate } = useLanguageTranslation();
  const selectedEvent = eventTypes.find(e => e.value === greetingData.eventType);

  // Generate background classes based on settings
  const getBackgroundClasses = () => {
    if (!greetingData?.backgroundSettings) return '';
    
    const { backgroundSettings } = greetingData;
    let classes = '';
    
    if (backgroundSettings.gradient.enabled) {
      const direction = backgroundSettings.gradient.direction.replace('to ', '');
      classes += `bg-gradient-${direction} `;
    }
    
    if (backgroundSettings.animation.enabled) {
      switch (backgroundSettings.animation.type) {
        case 'stars': classes += 'bg-stars '; break;
        case 'sparkles': classes += 'bg-sparkles '; break;
        case 'particles': classes += 'bg-particles '; break;
        case 'hearts': classes += 'bg-falling-hearts '; break;
        case 'bubbles': classes += 'bg-floating-bubbles '; break;
        case 'dots': classes += 'bg-glowing-dots '; break;
        case 'rings': classes += 'bg-pulsing-rings '; break;
        case 'snow': classes += 'bg-snow '; break;
      }
    }
    
    return classes;
  };

  // Generate responsive media layout
  const getMediaLayout = () => {
    const baseClasses = 'gap-4';
    
    switch (greetingData.layout) {
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
      case 'masonry':
        return `columns-1 md:columns-2 lg:columns-3 ${baseClasses}`;
      case 'carousel':
        return `flex overflow-x-auto space-x-4 pb-4`;
      case 'stack':
        return `grid grid-cols-1 ${baseClasses}`;
      case 'collage':
        return `relative min-h-[400px] ${baseClasses}`;
      default:
        return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
    }
  };

  // Calculate media item styles based on layout
  const getMediaItemStyles = (mediaItem: any, index: number) => {
    const baseStyles = {
      aspectRatio: greetingData.layout === 'collage' ? 'auto' : '16/9'
    };

    if (greetingData.layout === 'collage') {
      return {
        ...baseStyles,
        position: 'absolute' as const,
        left: `${mediaItem.position.x}%`,
        top: `${mediaItem.position.y}%`,
        width: `${Math.min(mediaItem.position.width, 300)}px`,
        height: `${Math.min(mediaItem.position.height, 200)}px`,
        zIndex: mediaItem.priority || index
      };
    }

    return {
      ...baseStyles,
      width: '100%',
      height: 'auto',
      maxWidth: greetingData.layout === 'carousel' ? '250px' : '100%',
      minHeight: greetingData.layout === 'carousel' ? '150px' : 'auto'
    };
  };

  return (
    <div className={`relative ${getBackgroundClasses()}`}>
      {/* Background Elements */}
      {greetingData.emojis.map((emoji) => (
        <div
          key={emoji.id}
          className={`absolute animate-${emoji.animation} pointer-events-none z-0`}
          style={{
            left: `${emoji.position.x}%`,
            top: `${emoji.position.y}%`,
            fontSize: `${Math.min(emoji.size, 3)}rem`,
            opacity: 0.8
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      <div className={`relative z-10 space-y-6 ${
        greetingData.animationStyle === 'fade' ? 'animate-fade-in' : 
        greetingData.animationStyle === 'slide' ? 'animate-slide-in' :
        greetingData.animationStyle === 'zoom' ? 'animate-zoom-in' :
        greetingData.animationStyle === 'flip' ? 'animate-flip-in' :
        greetingData.animationStyle === 'rotate' ? 'animate-rotate-in' :
        greetingData.animationStyle === 'shake' ? 'animate-shake' :
        greetingData.animationStyle === 'swing' ? 'animate-swing' :
        greetingData.animationStyle === 'tada' ? 'animate-tada' :
        'animate-bounce-in'
      }`}>
        
        {/* Event Header */}
        <div className="text-center">
          <div className="text-4xl md:text-6xl mb-4 animate-bounce-in">
            {selectedEvent?.emoji}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {selectedEvent?.value === 'custom' && greetingData.customEventName 
              ? greetingData.customEventName 
              : selectedEvent?.label
            }
          </h2>
          {greetingData.receiverName && (
            <>
              <p className="text-lg text-muted-foreground mb-1">{translate('For')}</p>
              <p className="text-xl md:text-2xl font-bold text-primary">{greetingData.receiverName}</p>
            </>
          )}
        </div>

        {/* Text Messages */}
        {greetingData.texts.length > 0 && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {greetingData.texts.map((text) => (
              <div
                key={text.id}
                className={`bg-card/60 backdrop-blur p-4 rounded-lg shadow-lg animate-${text.animation}`}
                style={{
                  fontSize: Math.min(parseInt(text.style.fontSize) || 16, 24) + 'px',
                  fontWeight: text.style.fontWeight,
                  color: text.style.color,
                  textAlign: text.style.textAlign
                }}
              >
                {text.content}
              </div>
            ))}
          </div>
        )}

        {/* Media Gallery */}
        {greetingData.media.length > 0 && (
          <div className={getMediaLayout()}>
            {greetingData.media
              .sort((a, b) => (a.priority || 0) - (b.priority || 0))
              .map((mediaItem, index) => (
                <div
                  key={mediaItem.id}
                  className={`animate-${mediaItem.animation} rounded-lg shadow-md overflow-hidden bg-card/20 ${
                    greetingData.layout === 'collage' ? 'absolute' : ''
                  }`}
                  style={getMediaItemStyles(mediaItem, index)}
                >
                  {mediaItem.type === 'image' ? (
                    <img
                      src={mediaItem.url}
                      alt={`Greeting image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <video
                      src={mediaItem.url}
                      className="w-full h-full object-cover"
                      controls
                      muted
                      preload="metadata"
                      onError={(e) => {
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Background Video */}
        {greetingData.videoUrl && (
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <video
              src={greetingData.videoUrl}
              className="w-full h-auto max-h-64 object-cover"
              controls
              muted
              preload="metadata"
            />
          </div>
        )}

        {/* Sender */}
        {greetingData.senderName && (
          <div className="text-center pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-1">{translate('With love from')}</p>
            <p className="text-lg font-semibold text-primary">{greetingData.senderName}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;