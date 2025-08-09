import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { GreetingFormData } from '@/types/greeting';
import { eventTypes } from '@/data/eventTypes';
import ShareActions from '@/components/share/ShareActions';

interface PreviewProps {
  greetingData: GreetingFormData;
}

const Preview = ({ greetingData }: PreviewProps) => {
  const navigate = useNavigate();
  const greetingRef = useRef<HTMLDivElement>(null);
  const currentEvent = eventTypes.find(e => e.value === greetingData.eventType);

  // Generate background classes based on settings
  const getBackgroundClasses = () => {
    if (!greetingData?.backgroundSettings) return 'bg-gradient-to-br from-primary/10 via-background to-secondary/20';
    
    const { backgroundSettings } = greetingData;
    let classes = '';
    
    if (backgroundSettings.gradient.enabled) {
      const direction = backgroundSettings.gradient.direction.replace('to ', '');
      classes += `bg-gradient-${direction} `;
    } else {
      classes += 'bg-background ';
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

  return (
    <div className={`min-h-screen p-4 ${getBackgroundClasses()}`}>
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          onClick={() => navigate('/create', { state: { formData: greetingData } })}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Edit
        </Button>
      </div>

      {/* Background Audio */}
      {greetingData.audioUrl && (
        <audio autoPlay loop className="hidden">
          <source src={greetingData.audioUrl} type="audio/mpeg" />
        </audio>
      )}

      {/* Background Video */}
      {greetingData.videoUrl && (
        <video
          className="fixed inset-0 w-full h-full object-cover -z-10"
          autoPlay
          loop
          muted
          style={{
            left: `${greetingData.videoPosition.x}%`,
            top: `${greetingData.videoPosition.y}%`,
            width: `${greetingData.videoPosition.width}px`,
            height: `${greetingData.videoPosition.height}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <source src={greetingData.videoUrl} type="video/mp4" />
        </video>
      )}

      <div className="max-w-4xl mx-auto relative" ref={greetingRef}>
        {/* Emojis */}
        {greetingData.emojis.map((emoji) => (
          <div
            key={emoji.id}
            className={`absolute animate-${emoji.animation}`}
            style={{
              left: `${emoji.position.x}%`,
              top: `${emoji.position.y}%`,
              fontSize: `${emoji.size}rem`,
              zIndex: 10
            }}
          >
            {emoji.emoji}
          </div>
        ))}

        <Card className={`shadow-2xl ${currentEvent?.theme || ''} animate-fade-in relative overflow-hidden ${greetingData.borderSettings?.enabled ? `border-${greetingData.borderSettings.width} border-[${greetingData.borderSettings.color}] rounded-${greetingData.borderSettings.radius}` : ''}`}>
          <CardContent className="p-8 md:p-12">
            <div className={`space-y-8 ${
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
                <div className="text-8xl md:text-9xl mb-6 animate-bounce-in">{currentEvent?.emoji}</div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {currentEvent?.value === 'custom' && greetingData.customEventName ? greetingData.customEventName : currentEvent?.label}
                </h1>
                {greetingData.receiverName && (
                  <p className="text-2xl md:text-3xl text-muted-foreground mb-2">For</p>
                )}
                {greetingData.receiverName && (
                  <p className="text-3xl md:text-4xl font-bold text-primary">{greetingData.receiverName}</p>
                )}
              </div>

              {/* Text Messages */}
              <div className="space-y-6 max-w-3xl mx-auto">
                {greetingData.texts.map((text) => (
                  <div
                    key={text.id}
                    className={`bg-card/60 backdrop-blur p-6 rounded-xl shadow-lg animate-${text.animation}`}
                    style={{
                      fontSize: text.style.fontSize,
                      fontWeight: text.style.fontWeight,
                      color: text.style.color,
                      textAlign: text.style.textAlign
                    }}
                  >
                    {text.content}
                  </div>
                ))}
              </div>

              {/* Media Gallery */}
              {greetingData.media.length > 0 && (
                <div className={`${
                  greetingData.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
                  greetingData.layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-6' :
                  greetingData.layout === 'carousel' ? 'flex overflow-x-auto space-x-6' :
                  greetingData.layout === 'stack' ? 'grid grid-cols-1 gap-6' :
                  greetingData.layout === 'collage' ? 'relative min-h-[400px]' :
                  'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                } max-w-4xl mx-auto`}>
                  {greetingData.media
                    .sort((a, b) => a.priority - b.priority)
                    .map((mediaItem, index) => (
                      <div
                        key={mediaItem.id}
                        className={`animate-${mediaItem.animation} rounded-xl shadow-lg overflow-hidden ${
                          greetingData.layout === 'collage' ? 'absolute' : ''
                        }`}
                        style={{
                          width: greetingData.layout === 'collage' ? `${mediaItem.position.width}px` : '100%',
                          height: greetingData.layout === 'collage' ? `${mediaItem.position.height}px` : 'auto',
                          left: greetingData.layout === 'collage' ? `${mediaItem.position.x}%` : 'auto',
                          top: greetingData.layout === 'collage' ? `${mediaItem.position.y}%` : 'auto',
                          aspectRatio: greetingData.layout !== 'collage' ? '16/9' : 'auto'
                        }}
                      >
                        {mediaItem.type === 'image' ? (
                          <img
                            src={mediaItem.url}
                            alt={`Greeting image`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <video
                            src={mediaItem.url}
                            className="w-full h-full object-cover"
                            controls
                            muted
                          />
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Sender */}
              {greetingData.senderName && (
                <div className="text-center pt-8 border-t border-border/50">
                  <p className="text-lg text-muted-foreground mb-2">With love from</p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">{greetingData.senderName}</p>
                </div>
              )}

              {/* Share Actions */}
              <div className="flex flex-col items-center gap-4 pt-8">
                <ShareActions greetingData={greetingData} greetingRef={greetingRef} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Preview;