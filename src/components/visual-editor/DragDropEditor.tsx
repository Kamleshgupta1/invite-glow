import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MousePointer, Undo, Redo, Trash2, Copy, Move, ArrowLeft } from 'lucide-react';
import { TextContent, MediaItem } from '@/types/greeting';

interface DragDropEditorProps {
  greetingData: {
    texts: TextContent[];
    media: MediaItem[];
    emojis: any[];
  };
  onUpdate: (data: any) => void;
}

interface DragItem {
  id: string;
  type: 'text' | 'media' | 'emoji';
  element: any;
  isDragging: boolean;
}

const DragDropEditor = ({
  greetingData,
  onUpdate
}: DragDropEditorProps) => {
  const { texts, media, emojis } = greetingData;
  const [selectedItem, setSelectedItem] = useState<DragItem | null>(null);
  const [dragHistory, setDragHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent, item: DragItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    setSelectedItem(item);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Update position based on type
    if (dragData.type === 'text') {
      const updatedTexts = texts.map(text =>
        text.id === dragData.id
          ? { ...text, position: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } }
          : text
      );
      onUpdate({ ...greetingData, texts: updatedTexts });
    } else if (dragData.type === 'media') {
      const updatedMedia = media.map(item =>
        item.id === dragData.id
          ? { ...item, position: { ...item.position, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } }
          : item
      );
      onUpdate({ ...greetingData, media: updatedMedia });
    } else if (dragData.type === 'emoji') {
      const updatedEmojis = emojis.map(emoji =>
        emoji.id === dragData.id
          ? { ...emoji, position: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } }
          : emoji
      );
      onUpdate({ ...greetingData, emojis: updatedEmojis });
    }

    setSelectedItem(null);
  }, [texts, media, emojis, greetingData, onUpdate]);

  const updateSelectedItem = (field: string, value: any) => {
    if (!selectedItem) return;

    if (selectedItem.type === 'text') {
      const updatedTexts = texts.map(text =>
        text.id === selectedItem.id
          ? { ...text, [field]: value }
          : text
      );
      onUpdate({ ...greetingData, texts: updatedTexts });
    } else if (selectedItem.type === 'media') {
      const updatedMedia = media.map(item =>
        item.id === selectedItem.id
          ? { ...item, [field]: value }
          : item
      );
      onUpdate({ ...greetingData, media: updatedMedia });
    } else if (selectedItem.type === 'emoji') {
      const updatedEmojis = emojis.map(emoji =>
        emoji.id === selectedItem.id
          ? { ...emoji, [field]: value }
          : emoji
      );
      onUpdate({ ...greetingData, emojis: updatedEmojis });
    }
  };

  const deleteSelectedItem = () => {
    if (!selectedItem) return;

    if (selectedItem.type === 'text') {
      onUpdate({ ...greetingData, texts: texts.filter(text => text.id !== selectedItem.id) });
    } else if (selectedItem.type === 'media') {
      onUpdate({ ...greetingData, media: media.filter(item => item.id !== selectedItem.id) });
    } else if (selectedItem.type === 'emoji') {
      onUpdate({ ...greetingData, emojis: emojis.filter(emoji => emoji.id !== selectedItem.id) });
    }

    setSelectedItem(null);
  };

  const duplicateSelectedItem = () => {
    if (!selectedItem) return;

    if (selectedItem.type === 'text') {
      const originalText = texts.find(text => text.id === selectedItem.id);
      if (originalText) {
        const newText = {
          ...originalText,
          id: Date.now().toString(),
          position: { x: originalText.position.x + 5, y: originalText.position.y + 5 }
        };
        onUpdate({ ...greetingData, texts: [...texts, newText] });
      }
    } else if (selectedItem.type === 'media') {
      const originalMedia = media.find(item => item.id === selectedItem.id);
      if (originalMedia) {
        const newMedia = {
          ...originalMedia,
          id: Date.now().toString(),
          position: { ...originalMedia.position, x: originalMedia.position.x + 5, y: originalMedia.position.y + 5 }
        };
        onUpdate({ ...greetingData, media: [...media, newMedia] });
      }
    } else if (selectedItem.type === 'emoji') {
      const originalEmoji = emojis.find(emoji => emoji.id === selectedItem.id);
      if (originalEmoji) {
        const newEmoji = {
          ...originalEmoji,
          id: Date.now().toString(),
          position: { x: originalEmoji.position.x + 5, y: originalEmoji.position.y + 5 }
        };
        onUpdate({ ...greetingData, emojis: [...emojis, newEmoji] });
      }
    }
  };

  const animationOptions = [
    { value: 'fade', label: 'Fade In' },
    { value: 'slide', label: 'Slide In' },
    { value: 'zoom', label: 'Zoom In' },
    { value: 'bounce', label: 'Bounce In' },
    { value: 'rotate', label: 'Rotate In' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'shake', label: 'Shake' },
    { value: 'swing', label: 'Swing' }
  ];

  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            Visual Editor
          </div>
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Undo className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Redo className="h-3 w-3" />
          </Button>
          {selectedItem && (
            <>
              <Button size="sm" variant="outline" onClick={duplicateSelectedItem}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="destructive" onClick={deleteSelectedItem}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="relative w-full h-64 border-2 border-dashed border-border rounded-lg bg-muted/10 overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Text Elements */}
          {texts.map((text) => (
            <div
              key={text.id}
              draggable
              onDragStart={(e) => handleDragStart(e, { id: text.id, type: 'text', element: text, isDragging: false })}
              onClick={() => setSelectedItem({ id: text.id, type: 'text', element: text, isDragging: false })}
              className={`absolute cursor-move p-1 border-2 ${
                selectedItem?.id === text.id ? 'border-primary' : 'border-transparent'
              } hover:border-primary/50`}
              style={{
                left: `${text.position.x}%`,
                top: `${text.position.y}%`,
                fontSize: text.style.fontSize,
                fontWeight: text.style.fontWeight,
                color: text.style.color,
                textAlign: text.style.textAlign,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Move className="h-3 w-3 absolute -top-3 -left-3 text-primary opacity-0 group-hover:opacity-100" />
              {text.content}
            </div>
          ))}

          {/* Media Elements */}
          {media.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, { id: item.id, type: 'media', element: item, isDragging: false })}
              onClick={() => setSelectedItem({ id: item.id, type: 'media', element: item, isDragging: false })}
              className={`absolute cursor-move border-2 ${
                selectedItem?.id === item.id ? 'border-primary' : 'border-transparent'
              } hover:border-primary/50`}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                width: `${item.position.width}px`,
                height: `${item.position.height}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Move className="h-3 w-3 absolute -top-3 -left-3 text-primary opacity-0 group-hover:opacity-100" />
              {item.type === 'image' ? (
                <img src={item.url} alt="Media" className="w-full h-full object-cover rounded" />
              ) : (
                <video src={item.url} className="w-full h-full object-cover rounded" controls muted />
              )}
            </div>
          ))}

          {/* Emoji Elements */}
          {emojis.map((emoji) => (
            <div
              key={emoji.id}
              draggable
              onDragStart={(e) => handleDragStart(e, { id: emoji.id, type: 'emoji', element: emoji, isDragging: false })}
              onClick={() => setSelectedItem({ id: emoji.id, type: 'emoji', element: emoji, isDragging: false })}
              className={`absolute cursor-move border-2 ${
                selectedItem?.id === emoji.id ? 'border-primary' : 'border-transparent'
              } hover:border-primary/50`}
              style={{
                left: `${emoji.position.x}%`,
                top: `${emoji.position.y}%`,
                fontSize: `${emoji.size}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Move className="h-3 w-3 absolute -top-3 -left-3 text-primary opacity-0 group-hover:opacity-100" />
              {emoji.emoji}
            </div>
          ))}
        </div>

        {/* Properties Panel */}
        {selectedItem && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Edit {selectedItem.type}</h4>
            
            {selectedItem.type === 'text' && (
              <>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={selectedItem.element.content}
                    onChange={(e) => updateSelectedItem('content', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label>Font Size</Label>
                  <Input
                    value={selectedItem.element.style.fontSize}
                    onChange={(e) => updateSelectedItem('style', { ...selectedItem.element.style, fontSize: e.target.value })}
                    placeholder="24px"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={selectedItem.element.style.color}
                    onChange={(e) => updateSelectedItem('style', { ...selectedItem.element.style, color: e.target.value })}
                  />
                </div>
              </>
            )}

            {selectedItem.type === 'media' && (
              <>
                <div>
                  <Label>Width ({selectedItem.element.position.width}px)</Label>
                  <Slider
                    value={[selectedItem.element.position.width]}
                    onValueChange={([width]) => updateSelectedItem('position', { ...selectedItem.element.position, width })}
                    min={50}
                    max={400}
                    step={10}
                  />
                </div>
                <div>
                  <Label>Height ({selectedItem.element.position.height}px)</Label>
                  <Slider
                    value={[selectedItem.element.position.height]}
                    onValueChange={([height]) => updateSelectedItem('position', { ...selectedItem.element.position, height })}
                    min={50}
                    max={400}
                    step={10}
                  />
                </div>
              </>
            )}

            {selectedItem.type === 'emoji' && (
              <>
                <div>
                  <Label>Emoji</Label>
                  <Input
                    value={selectedItem.element.emoji}
                    onChange={(e) => updateSelectedItem('emoji', e.target.value)}
                    placeholder="🎉"
                  />
                </div>
                <div>
                  <Label>Size ({selectedItem.element.size}px)</Label>
                  <Slider
                    value={[selectedItem.element.size]}
                    onValueChange={([size]) => updateSelectedItem('size', size)}
                    min={12}
                    max={72}
                    step={4}
                  />
                </div>
              </>
            )}

            <div>
              <Label>Animation</Label>
              <Select
                value={selectedItem.element.animation}
                onValueChange={(animation) => updateSelectedItem('animation', animation)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {animationOptions.map((anim) => (
                    <SelectItem key={anim.value} value={anim.value}>
                      {anim.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DragDropEditor;