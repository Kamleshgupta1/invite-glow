import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EventType {
  value: string;
  label: string;
  emoji: string;
  theme: string;
}

const eventTypes: EventType[] = [
  { value: 'birthday', label: 'Birthday', emoji: '🎂', theme: 'card-birthday' },
  { value: 'anniversary', label: 'Anniversary', emoji: '💍', theme: 'card-anniversary' },
  { value: 'retirement', label: 'Retirement', emoji: '👴', theme: 'card-retirement' },
  { value: 'festival', label: 'Festival', emoji: '🎊', theme: 'card-festival' },
  { value: 'promotion', label: 'Promotion', emoji: '📈', theme: 'card-promotion' },
  { value: 'farewell', label: 'Farewell', emoji: '👋', theme: 'card-farewell' },
  { value: 'graduation', label: 'Graduation', emoji: '🎓', theme: 'card-graduation' },
  { value: 'custom', label: 'Custom', emoji: '✨', theme: 'card-custom' }
];

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [greetingData, setGreetingData] = useState<any>(null);
  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.toString()) {
      // Extract greeting data from URL parameters
      const data = {
        eventType: params.get('eventType') || '',
        senderName: params.get('senderName') || '',
        receiverName: params.get('receiverName') || '',
        message1: params.get('message1') || '',
        message2: params.get('message2') || '',
        message3: params.get('message3') || '',
        animationStyle: params.get('animationStyle') || 'fade',
        customCSS: params.get('customCSS') || '',
        audioUrl: params.get('audioUrl') || '',
        images: [
          params.get('image1') || '',
          params.get('image2') || '',
          params.get('image3') || ''
        ].filter(img => img)
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

  // Show greeting if data exists
  if (greetingData && greetingData.eventType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
        {/* Background Audio */}
        {greetingData.audioUrl && (
          <audio autoPlay loop className="hidden">
            <source src={greetingData.audioUrl} type="audio/mpeg" />
          </audio>
        )}

        <div className="max-w-4xl mx-auto">
          <Card className={`shadow-2xl ${currentEvent?.theme || ''} animate-fade-in`}>
            <CardContent className="p-8 md:p-12">
              <div className={`space-y-8 ${greetingData.animationStyle === 'fade' ? 'animate-fade-in' : 
                                            greetingData.animationStyle === 'slide' ? 'animate-slide-in' :
                                            greetingData.animationStyle === 'zoom' ? 'animate-zoom-in' :
                                            greetingData.animationStyle === 'flip' ? 'animate-flip-in' :
                                            'animate-bounce-in'} ${greetingData.customCSS}`}>
                
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

                {/* Messages */}
                <div className="space-y-6 max-w-3xl mx-auto">
                  {greetingData.message1 && (
                    <div className="text-xl md:text-2xl leading-relaxed text-center bg-card/60 backdrop-blur p-6 rounded-xl shadow-lg animate-slide-in">
                      {greetingData.message1}
                    </div>
                  )}
                  {greetingData.message2 && (
                    <div className="text-lg md:text-xl leading-relaxed text-center bg-card/40 backdrop-blur p-5 rounded-xl animate-slide-in">
                      {greetingData.message2}
                    </div>
                  )}
                  {greetingData.message3 && (
                    <div className="text-lg md:text-xl leading-relaxed text-center bg-card/40 backdrop-blur p-5 rounded-xl animate-slide-in">
                      {greetingData.message3}
                    </div>
                  )}
                </div>

                {/* Images */}
                {greetingData.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {greetingData.images.map((url: string, index: number) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Greeting image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-xl shadow-lg animate-zoom-in"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
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

                {/* Action Button */}
                <div className="text-center pt-8">
                  <Button
                    onClick={shareWithSomeoneElse}
                    size="lg"
                    className="text-lg px-8 py-4 animate-bounce-in shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    ✨ Share This With Someone Else
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
