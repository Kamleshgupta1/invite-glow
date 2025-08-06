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
import { eventTypes, animationStyles } from '@/data/eventTypes';
import EventTypeSelector from '@/components/greeting/EventTypeSelector';
import MediaUploader from '@/components/greeting/MediaUploader';
import TextEditor from '@/components/greeting/TextEditor';
import VideoUploader from '@/components/greeting/VideoUploader';
import LayoutSelector from '@/components/greeting/LayoutSelector';

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
    theme: ''
  });

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  useEffect(() => {
    if (formData.eventType) {
      const event = eventTypes.find(e => e.value === formData.eventType);
      setSelectedEvent(event || null);
      if (event && !formData.message1) {
        setFormData(prev => ({ ...prev, message1: event.defaultMessage }));
      }
    }
  }, [formData.eventType]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData(prev => ({ ...prev, imageUrls: newImageUrls }));
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
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'imageUrls') {
        (value as string[]).forEach((url: string, index: number) => {
          if (url) params.append(`image${index + 1}`, url);
        });
      } else if (value) {
        params.append(key, value as string);
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
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'imageUrls') {
        (value as string[]).forEach((url: string, index: number) => {
          if (url) params.append(`image${index + 1}`, url);
        });
      } else if (value) {
        params.append(key, value as string);
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
              {/* Event Type */}
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type *</Label>
                <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((event) => (
                      <SelectItem key={event.value} value={event.value}>
                        {event.emoji} {event.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              {/* Messages */}
              <div className="space-y-4">
                <Label>Messages</Label>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="space-y-2">
                    <Label htmlFor={`message${num}`}>Message {num} {num === 1 ? '(main message)' : '(optional)'}</Label>
                    <Textarea
                      id={`message${num}`}
                      value={formData[`message${num}` as keyof typeof formData] as string}
                      onChange={(e) => handleInputChange(`message${num}`, e.target.value)}
                      placeholder={`Enter your ${num === 1 ? 'main' : 'additional'} message`}
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              {/* Images */}
              <div className="space-y-4">
                <Label>Images (optional)</Label>
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`image${index + 1}`}>Image {index + 1} URL</Label>
                    <Input
                      id={`image${index + 1}`}
                      value={formData.imageUrls[index]}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                  </div>
                ))}
              </div>

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

              {/* Animation Style */}
              <div className="space-y-2">
                <Label htmlFor="animationStyle">Animation Style</Label>
                <Select value={formData.animationStyle} onValueChange={(value) => handleInputChange('animationStyle', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {animationStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button onClick={previewGreeting} className="flex-1" variant="outline">
                  👁️ Preview
                </Button>
                <Button onClick={generateShareableURL} className="flex-1">
                  🔗 Generate & Share
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
              {formData.eventType ? (
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
                    {formData.message1 && (
                      <p className="text-lg leading-relaxed text-center bg-card/50 p-4 rounded-lg">
                        {formData.message1}
                      </p>
                    )}
                    {formData.message2 && (
                      <p className="text-base leading-relaxed text-center bg-card/30 p-3 rounded-lg">
                        {formData.message2}
                      </p>
                    )}
                    {formData.message3 && (
                      <p className="text-base leading-relaxed text-center bg-card/30 p-3 rounded-lg">
                        {formData.message3}
                      </p>
                    )}
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formData.imageUrls.filter(url => url).map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Greeting image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
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