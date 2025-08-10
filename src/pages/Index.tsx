import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GreetingFormData } from '@/types/greeting';
import { eventTypes } from '@/data/eventTypes';
import ShareActions from '@/components/share/ShareActions';
import SEOManager from '@/components/seo/SEOManager';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [greetingData, setGreetingData] = useState<GreetingFormData | null>(null);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.toString()) {
      // Extract greeting data from URL parameters with new structure
      const data: GreetingFormData = {
        eventType: params.get('eventType') || '',
        senderName: params.get('senderName') || '',
        receiverName: params.get('receiverName') || '',
        texts: params.get('texts') ? JSON.parse(params.get('texts')!) : [],
        media: params.get('media') ? JSON.parse(params.get('media')!) : [],
        videoUrl: params.get('videoUrl') || '',
        videoPosition: params.get('videoPosition') ? JSON.parse(params.get('videoPosition')!) : { x: 50, y: 50, width: 400, height: 300 },
        audioUrl: params.get('audioUrl') || '',
        animationStyle: params.get('animationStyle') || 'fade',
        
        layout: (params.get('layout') as any) || 'grid',
        theme: params.get('theme') || '',
        backgroundSettings: params.get('backgroundSettings') ? JSON.parse(params.get('backgroundSettings')!) : {
          color: '#ffffff',
          gradient: { enabled: false, colors: ['#ffffff', '#000000'], direction: 'to right' },
          animation: { enabled: false, type: 'stars', speed: 3, intensity: 50 },
          pattern: { enabled: false, type: 'dots', opacity: 20 }
        },
        emojis: params.get('emojis') ? JSON.parse(params.get('emojis')!) : [],
        borderSettings: params.get('borderSettings') ? JSON.parse(params.get('borderSettings')!) : {
          enabled: false,
          style: 'solid',
          width: 2,
          color: '#000000',
          radius: 0,
          animation: { enabled: false, type: 'none', speed: 3 },
          elements: [],
          decorativeElements: []
        }
      };
      
      setGreetingData(data);
      
      // Find current event type
      const event = eventTypes.find(e => e.value === data.eventType);
      setCurrentEvent(event || null);
    }
  }, [location.search]);

  const shareWithSomeoneElse = () => {
    const params = new URLSearchParams();
    if (greetingData?.eventType) {
      params.append('eventType', greetingData.eventType);
    }
    if (greetingData?.senderName) {
      params.append('senderName', greetingData.senderName);
    }
    navigate(`/create?${params.toString()}`);
  };

  const createNewGreeting = () => {
    navigate('/create');
  };

  // Generate background classes based on settings
  const getBackgroundClasses = () => {
    if (!greetingData?.backgroundSettings) return 'bg-gradient-to-br from-primary/10 via-background to-secondary/20';
    
    const { backgroundSettings } = greetingData;
    let classes = '';
    
    if (backgroundSettings.gradient.enabled) {
      classes += `bg-gradient-to-${backgroundSettings.gradient.direction.replace('to ', '')} `;
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

  // Show greeting if data exists
  if (greetingData && greetingData.eventType) {
    return (
      <div className={`min-h-screen p-4 ${getBackgroundClasses()}`}>

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

        <div className="max-w-4xl mx-auto relative">
          {/* Emojis */}
          {greetingData.emojis.map((emoji) => (
            <div
              key={emoji.id}
              className={`absolute text-${emoji.size}xl animate-${emoji.animation}`}
              style={{
                left: `${emoji.position.x}%`,
                top: `${emoji.position.y}%`,
                fontSize: `${emoji.size}rem`
              }}
            >
              {emoji.emoji}
            </div>
          ))}

          <Card className={`shadow-2xl ${currentEvent?.theme || ''} animate-fade-in relative overflow-hidden ${greetingData.borderSettings?.enabled ? `border-${greetingData.borderSettings.width} border-[${greetingData.borderSettings.color}] rounded-${greetingData.borderSettings.radius}` : ''}`}>
            <CardContent className="p-8 md:p-12">
              <div className={`space-y-8 ${greetingData.animationStyle === 'fade' ? 'animate-fade-in' : 
                                            greetingData.animationStyle === 'slide' ? 'animate-slide-in' :
                                            greetingData.animationStyle === 'zoom' ? 'animate-zoom-in' :
                                            greetingData.animationStyle === 'flip' ? 'animate-flip-in' :
                                            greetingData.animationStyle === 'rotate' ? 'animate-rotate-in' :
                                            greetingData.animationStyle === 'shake' ? 'animate-shake' :
                                            greetingData.animationStyle === 'swing' ? 'animate-swing' :
                                             greetingData.animationStyle === 'tada' ? 'animate-tada' :
                                             'animate-bounce-in'}`}>
                
                {/* Event Header */}
                <div className="text-center">
                  <div className="text-8xl md:text-9xl mb-6 animate-bounce-in">{currentEvent?.emoji}</div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {currentEvent?.label}
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
                        textAlign: text.style.textAlign,
                        position: 'relative',
                        left: `${text.position.x}%`,
                        top: `${text.position.y}%`
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
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  } max-w-4xl mx-auto`}>
                    {greetingData.media
                      .sort((a, b) => a.priority - b.priority)
                      .map((mediaItem) => (
                        <div
                          key={mediaItem.id}
                          className={`animate-${mediaItem.animation} rounded-xl shadow-lg overflow-hidden`}
                          style={{
                            width: `${mediaItem.position.width}px`,
                            height: `${mediaItem.position.height}px`,
                            position: greetingData.layout === 'collage' ? 'absolute' : 'relative',
                            left: greetingData.layout === 'collage' ? `${mediaItem.position.x}%` : 'auto',
                            top: greetingData.layout === 'collage' ? `${mediaItem.position.y}%` : 'auto'
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
                  <ShareActions greetingData={greetingData} />
                  <Button
                    onClick={shareWithSomeoneElse}
                    size="lg"
                    className="text-lg px-8 py-4 animate-bounce-in shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    ✨ Customize & Share with Others
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show landing page if no greeting data
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
      <SEOManager 
        eventType="greeting"
        isPreview={false}
      />
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-fade-in">
          <div className="text-8xl mb-8 animate-bounce-in">🎉</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Beautiful Greetings
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Create stunning, personalized greeting cards for any occasion. Share joy, love, and celebration with beautiful animations and custom messages.
          </p>
          
          <Card className="max-w-2xl mx-auto mb-12 shadow-xl animate-slide-in">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">✨ Features</h2>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <p>🎂 8+ Event Types</p>
                  <p>🎨 Custom Animations</p>
                  <p>📱 Fully Responsive</p>
                  <p>🔗 Shareable Links</p>
                </div>
                <div className="space-y-2">
                  <p>🖼️ Image Support</p>
                  <p>🎵 Background Music</p>
                  <p>💬 Multiple Messages</p>
                  <p>🎭 Event Themes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={createNewGreeting}
            size="lg"
            className="text-xl px-12 py-6 animate-zoom-in shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            🚀 Create Your Greeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
