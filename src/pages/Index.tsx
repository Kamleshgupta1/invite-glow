import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GreetingFormData, EventType } from '@/types/greeting';
import { eventTypes, animationStyles } from '@/data/eventTypes';
import ShareActions from '@/components/share/ShareActions';
import SEOManager from '@/components/seo/SEOManager';
import { motion, AnimatePresence } from 'framer-motion';
import TypingText from '../components/reusableTypingText/TypingText'
import { useLanguageTranslation } from '@/hooks/useLanguageTranslation';


const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [greetingData, setGreetingData] = useState<GreetingFormData | null>(null);
  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const greetingRef = useRef<HTMLDivElement>(null);
  const { translate } = useLanguageTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.toString()) {
      // Extract greeting data from URL parameters with new structure
      const data: GreetingFormData = {
        eventType: params.get('eventType') || '',
        senderName: params.get('senderName') || '',
        receiverName: params.get('receiverName') || '',
        customEventName: params.get('customEventName') || '', // Add custom event name
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
      
      // Handle both predefined and custom events

      if (data.eventType === 'custom') {

        // Create custom event object

        setCurrentEvent({

          value: 'custom',

          emoji: '🎉', // Default emoji or you could pass this as a param

          label: data.customEventName || 'Custom Event',

          defaultMessage: data.texts[0]?.content || 'Wishing you a wonderful celebration!',

          theme: data.theme || '',

          category: 'custom'

        });

      } else {

        // Find predefined event type

        const event = eventTypes.find(e => e.value === data.eventType);

        setCurrentEvent(event || null);

      }

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
      // Move the ref to this outer container that wraps ALL greeting content
    <div ref={greetingRef} className={`min-h-screen p-4 ${getBackgroundClasses()}`}>
      {/* <div className={`min-h-screen p-4 ${getBackgroundClasses()}`}> */}

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
                <div className="flex flex-col items-center gap-4 pt-8 no-capture">
                  <ShareActions greetingData={greetingData} greetingRef={greetingRef} />
                  {/* <ShareActions greetingData={greetingData} /> */}
            

<Button
  onClick={shareWithSomeoneElse}
  size="sm"
  className="p-5 relative overflow-hidden group animate-zoom-in shadow-2xl hover:shadow-primary/30 transition-all duration-500 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l"
>
  <span className="relative z-10 flex items-center">
    <span className="mr-3 text-2xl group-hover:animate-spin">✨</span>
    <span>Customize and share with others</span>
  </span>
  
  {/* Button shine effect */}
  <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
  
  {/* Border elements */}
  <span className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg 
                  group-hover:rounded-none transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]" />
  
  {/* Lightning border animation */}
  <span className="absolute inset-0 border-2 border-transparent 
                  group-hover:border-[length:400%_400%] group-hover:bg-[length:400%_400%]
                  group-hover:animate-lightning-rounding" />
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
   <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4 sm:p-6">
  <SEOManager 
    eventType="greeting"
    isPreview={false}
  />
  
  {/* Main container with max-width and centered content */}
  <div className="max-w-4xl mx-auto">

    {/* Hero section */}
    <div className="relative text-center px-4 sm:px-6 mb-12 sm:mb-16">
      {/* Floating decorative emojis - hidden on mobile */}
   {/* Animated Emoji Background Elements */}
<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
  {[
    { emoji: '🎈', animation: 'float-x' },
    { emoji: '✨', animation: 'float-y' },
    { emoji: '🌸', animation: 'rotate' },
    { emoji: '🎊', animation: 'bounce-slow' },
    { emoji: '🎨', animation: 'spin-slow' },
    { emoji: '❤️', animation: 'pulse' },
    { emoji: '🎁', animation: 'bounce' },
    { emoji: '🌟', animation: 'twinkle' },
    { emoji: '🎉', animation: 'tada-slow' },
    { emoji: '🌈', animation: 'color-shift' }
  ].map((item, index) => {
    // Generate random positions (0-100% of viewport)
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 10 + Math.random() * 20;
    const size = 2 + Math.random() * 4; // emoji size multiplier
    
    return (
      <motion.div
        key={index}
        className={`text-3xl md:text-4xl absolute opacity-20 hover:opacity-70 transition-opacity cursor-pointer`}
        style={{
          left: `${posX}%`,
          top: `${posY}%`,
          fontSize: `${size}rem`,
          zIndex: Math.floor(size * 10)
        }}
        animate={{
          y: [0, -20, 0, 20, 0],
          x: [0, 15, 0, -15, 0],
          rotate: [0, 10, -5, 5, 0]
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: delay
        }}
        whileHover={{
          scale: 1.5,
          opacity: 1,
          transition: { duration: 0.3 }
        }}
      >
        {item.emoji}
      </motion.div>
    );
  })}
</div>

      {/* Main hero content */}
      <div className="relative z-10">
        {/* Animated emoji */}
        <div className="relative inline-block">
          <div className="text-6xl sm:text-8xl md:text-9xl mb-4 sm:mb-6 animate-bounce-in hover:animate-tada cursor-pointer">
            🎉
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_70%)] animate-pulse-slow pointer-events-none"></div>
        </div>

        {/* Gradient heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
          {translate('Beautiful Greetings')}
        </h1>

        {/* Description */}
        <TypingText
          texts={[
            "Create stunning, personalized greeting cards for any occasion.",
            "Share joy, love, and celebration with beautiful animations.",
            "Send your wishes in style with custom messages!"
          ]}
          typingSpeed={40}
          pauseBetweenTexts={2000}
          loop={true}
        />

      </div>

      {/* Primary CTA button */}
      <Button
        onClick={createNewGreeting}
        size="lg"
        className="relative overflow-hidden group px-6 sm:px-12 py-4 sm:py-7 mb-8 sm:mb-12 animate-zoom-in shadow-lg sm:shadow-2xl hover:shadow-primary/30 transition-all duration-500 w-full sm:w-auto"
      >
        <span className="relative z-10 flex items-center justify-center sm:justify-start">
          <span className="mr-2 sm:mr-3 text-xl sm:text-2xl group-hover:animate-spin">✨</span>
          <span className="text-sm sm:text-base md:text-lg">
            Surprise Them! Design Your Greeting!
          </span>
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
      </Button>
    </div>

    {/* Feature card */}
    <div className="perspective-1000 mb-12 sm:mb-16 px-4 sm:px-0">
      <div className="transform-style-preserve-3d hover:rotate-y-6 hover:rotate-x-2 transition-transform duration-500 ease-out">
        <Card className="mx-auto shadow-lg sm:shadow-2xl animate-slide-in bg-gradient-to-br from-background to-muted/50 border border-muted/30 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-xl sm:text-2xl">✨</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Amazing Features
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: '🎂', text: '20+ Event Types' },
                  { icon: '🎨', text: 'Custom Animations' },
                  { icon: '📱', text: 'Fully Responsive' },
                  { icon: '🔗', text: 'Shareable Links' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center group">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3 group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span className="text-base sm:text-lg group-hover:text-primary transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: '🖼️', text: 'Image & Video Support' },
                  { icon: '🎵', text: 'Background Music' },
                  { icon: '💬', text: 'Multiple Messages' },
                  { icon: '🎭', text: 'Event Themes' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center group">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3 group-hover:rotate-12 transition-transform">{item.icon}</span>
                    <span className="text-base sm:text-lg group-hover:text-primary transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Secondary CTA button */}
    <div className="text-center px-4 sm:px-0">
      <Button
        onClick={createNewGreeting}
        size="lg"
        className="relative overflow-hidden group px-6 sm:px-12 py-4 sm:py-7 animate-zoom-in shadow-lg sm:shadow-2xl hover:shadow-primary/30 transition-all duration-500 w-full sm:w-auto"
      >
        <span className="relative z-10 flex items-center justify-center sm:justify-start">
          <span className="mr-2 sm:mr-3 text-xl sm:text-2xl group-hover:animate-spin">🚀</span>
          <span className="text-sm sm:text-base md:text-lg">
            Let's Get Started!
          </span>
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
      </Button>
    </div>

    {/* Floating particles background */}
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-primary/10"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 20 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  </div>
</div>
  );
};

export default Index;
