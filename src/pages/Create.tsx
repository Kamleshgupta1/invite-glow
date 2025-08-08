import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { GreetingFormData, MediaItem, TextContent, EventType } from '@/types/greeting';
import { BorderSettings } from '@/types/background';
import { eventTypes, animationStyles } from '@/data/eventTypes';
import CustomEventSelector from '@/components/greeting/CustomEventSelector';
import AdvancedMediaUploader from '@/components/greeting/AdvancedMediaUploader';
import AdvancedTextEditor from '@/components/greeting/AdvancedTextEditor';
import VideoUploader from '@/components/greeting/VideoUploader';
import LayoutSelector from '@/components/greeting/LayoutSelector';
import BackgroundCustomizer from '@/components/greeting/BackgroundCustomizer';
import EmojiSelector from '@/components/greeting/EmojiSelector';
import BorderCustomizer from '@/components/border/BorderCustomizer';
import LanguageSelector from '@/components/language/LanguageSelector';
import ShareActions from '@/components/share/ShareActions';
import DragDropEditor from '@/components/visual-editor/DragDropEditor';

const Create = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [formData, setFormData] = useState<GreetingFormData>({
    eventType: '',
    senderName: '',
    receiverName: '',
    texts: [],
    media: [],
    videoUrl: '',
    videoPosition: { x: 50, y: 50, width: 400, height: 300 },
    audioUrl: '',
    animationStyle: 'fade',
    customCSS: '',
    layout: 'grid',
    theme: '',
    backgroundSettings: {
      color: '#ffffff',
      gradient: { enabled: false, colors: ['#ffffff', '#000000'], direction: 'to right' },
      animation: { enabled: false, type: 'stars', speed: 3, intensity: 50 },
      pattern: { enabled: false, type: 'dots', opacity: 20 }
    },
    emojis: [],
    borderSettings: {
      enabled: false,
      style: 'solid',
      width: 2,
      color: '#000000',
      radius: 0,
      animation: { enabled: false, type: 'none', speed: 3 },
      elements: [],
      decorativeElements: []
    }
  });

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [customEvent, setCustomEvent] = useState<EventType | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showVisualEditor, setShowVisualEditor] = useState(false);

  useEffect(() => {
    if (formData.eventType) {
      const event = eventTypes.find(e => e.value === formData.eventType);
      setSelectedEvent(event || null);
      if (event && formData.texts.length === 0) {
        setFormData(prev => ({ 
          ...prev, 
          texts: [{ 
            id: Date.now().toString(),
            content: event.defaultMessage,
            position: { x: 50, y: 50 },
            style: { fontSize: '24px', fontWeight: 'normal', color: 'hsl(var(--foreground))', textAlign: 'center' },
            animation: 'fade'
          }]
        }));
      }
    }
  }, [formData.eventType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaChange = (newMedia: MediaItem[]) => {
    setFormData(prev => ({ ...prev, media: newMedia }));
  };

  const handleTextChange = (newTexts: TextContent[]) => {
    setFormData(prev => ({ ...prev, texts: newTexts }));
  };

  const generateShareableURL = () => {
    if (!formData.eventType) {
      toast({
        title: "Please select an event type",
        description: "Event type is required to generate a sharable link.",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams();
    // Add basic form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'texts' && Array.isArray(value)) {
        params.append('texts', JSON.stringify(value));
      } else if (key === 'media' && Array.isArray(value)) {
        params.append('media', JSON.stringify(value));
      } else if (key === 'videoPosition') {
        params.append('videoPosition', JSON.stringify(value));
      } else if (value && typeof value === 'string') {
        params.append(key, value);
      }
    });

    const shareableURL = `${window.location.origin}/?${params.toString()}`;
    navigator.clipboard.writeText(shareableURL);
    
    toast({
      title: "Link copied!",
      description: "Sharable greeting URL has been copied to your clipboard.",
    });
  };

  const previewGreeting = () => {
    if (!formData.eventType) {
      toast({
        title: "Please select an event type",
        description: "Event type is required to preview the greeting.",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams();
    // Add basic form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'texts' && Array.isArray(value)) {
        params.append('texts', JSON.stringify(value));
      } else if (key === 'media' && Array.isArray(value)) {
        params.append('media', JSON.stringify(value));
      } else if (key === 'videoPosition') {
        params.append('videoPosition', JSON.stringify(value));
      } else if (value && typeof value === 'string') {
        params.append(key, value);
      }
    });

    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ✨ Create Your Greeting
          </h1>
          <p className="text-lg text-muted-foreground">Design a beautiful, personalized greeting to share with someone special</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="animate-slide-in shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎨 Customize Your Greeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Custom Event Selector */}
              <CustomEventSelector
                selectedEvent={formData.eventType}
                customEvent={customEvent}
                onEventChange={(value) => handleInputChange('eventType', value)}
                onCustomEventCreate={setCustomEvent}
              />

              {/* Names */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Your Name (optional)</Label>
                  <Input
                    id="senderName"
                    value={formData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Receiver's Name (optional)</Label>
                  <Input
                    id="receiverName"
                    value={formData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    placeholder="Recipient's name"
                  />
                </div>
              </div>

              <Separator />

              {/* Advanced Text Editor (up to 10 texts) */}
              <AdvancedTextEditor
                texts={formData.texts}
                onChange={handleTextChange}
              />

              <Separator />

              {/* Advanced Media Uploader (up to 20 images/videos) */}
              <AdvancedMediaUploader
                media={formData.media}
                onChange={handleMediaChange}
              />

              <Separator />

              {/* Background Customizer */}
              <BackgroundCustomizer
                settings={formData.backgroundSettings}
                onChange={(settings) => setFormData(prev => ({ ...prev, backgroundSettings: settings }))}
              />

              <Separator />

              {/* Border Customizer */}
              <BorderCustomizer
                settings={formData.borderSettings}
                onChange={(borderSettings) => setFormData(prev => ({ ...prev, borderSettings }))}
              />

              <Separator />

              {/* Emoji Decorator */}
              <EmojiSelector
                emojis={formData.emojis}
                onChange={(emojis) => setFormData(prev => ({ ...prev, emojis }))}
              />

              <Separator />

              {/* Video Uploader */}
              <VideoUploader
                videoUrl={formData.videoUrl}
                videoPosition={formData.videoPosition}
                onVideoUrlChange={(url) => handleInputChange('videoUrl', url)}
                onPositionChange={(position) => setFormData(prev => ({ ...prev, videoPosition: position }))}
              />

              <Separator />

              {/* Layout & Animation Selector */}
              <LayoutSelector
                layout={formData.layout}
                animationStyle={formData.animationStyle}
                onLayoutChange={(layout) => handleInputChange('layout', layout)}
                onAnimationChange={(animation) => handleInputChange('animationStyle', animation)}
              />

              <Separator />

              {/* Audio */}
              <div className="space-y-2">
                <Label htmlFor="audioUrl">Background Music URL (optional)</Label>
                <Input
                  id="audioUrl"
                  value={formData.audioUrl}
                  onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                  placeholder="https://example.com/music.mp3"
                  type="url"
                />
              </div>

              {/* Custom CSS */}
              <div className="space-y-2">
                <Label htmlFor="customCSS">Custom CSS Class (optional)</Label>
                <Input
                  id="customCSS"
                  value={formData.customCSS}
                  onChange={(e) => handleInputChange('customCSS', e.target.value)}
                  placeholder="custom-class-name"
                />
              </div>

              {/* Language Selector */}
              <div className="space-y-2">
                <Label>Language</Label>
                <LanguageSelector 
                  currentLanguage={currentLanguage}
                  onLanguageChange={setCurrentLanguage}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex gap-4">
                  <Button onClick={previewGreeting} className="flex-1" variant="outline">
                    👁️ Preview Greeting
                  </Button>
                  <Button 
                    onClick={() => setShowVisualEditor(!showVisualEditor)} 
                    className="flex-1" 
                    variant="secondary"
                  >
                    🎨 Visual Editor
                  </Button>
                </div>
                <ShareActions greetingData={formData} />
                <Button onClick={generateShareableURL} className="w-full">
                  ✨ Customize & Share with Others
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview Section */}
          <Card className={`animate-zoom-in shadow-xl ${selectedEvent?.theme || ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👀 Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showVisualEditor && formData.eventType ? (
                <DragDropEditor 
                  greetingData={formData}
                  onUpdate={setFormData}
                />
              ) : formData.eventType ? (
                <div className={`space-y-6 ${formData.animationStyle === 'fade' ? 'animate-fade-in' : 
                                              formData.animationStyle === 'slide' ? 'animate-slide-in' :
                                              formData.animationStyle === 'zoom' ? 'animate-zoom-in' :
                                              formData.animationStyle === 'flip' ? 'animate-flip-in' :
                                              'animate-bounce-in'} ${formData.customCSS}`}>
                  
                  {/* Event Header */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">{selectedEvent?.emoji}</div>
                    <h2 className="text-3xl font-bold mb-2">{selectedEvent?.label}</h2>
                    {formData.receiverName && (
                      <p className="text-xl text-muted-foreground">For {formData.receiverName}</p>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="space-y-4">
                    {formData.texts.map((text, index) => (
                      <div
                        key={index}
                        className={`text-center bg-card/50 p-4 rounded-lg animate-${text.animation}`}
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

                  {/* Images */}
                  <div className={`grid gap-4 ${
                    formData.layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                    formData.layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3' :
                    formData.layout === 'carousel' ? 'flex overflow-x-auto space-x-4' :
                    formData.layout === 'stack' ? 'grid grid-cols-1' :
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {formData.media.map((mediaItem, index) => (
                      <div
                        key={index}
                        className={`animate-${mediaItem.animation} rounded-lg shadow-md overflow-hidden`}
                        style={{
                          width: `${mediaItem.position.width}px`,
                          height: `${mediaItem.position.height}px`
                        }}
                      >
                        {mediaItem.type === 'image' ? (
                          <img
                            src={mediaItem.url}
                            alt={`Greeting image ${index + 1}`}
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

                  {/* Sender */}
                  {formData.senderName && (
                    <div className="text-center pt-4 border-t">
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="text-lg font-semibold">{formData.senderName}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <div className="text-4xl mb-4">🎨</div>
                  <p>Select an event type to see your greeting preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Create;