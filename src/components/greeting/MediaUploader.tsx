import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaItem } from '@/types/greeting';
import { animationStyles } from '@/data/eventTypes';
import { Trash2, GripVertical, Image, Video } from 'lucide-react';

interface MediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

const MediaUploader = ({ media, onChange }: MediaUploaderProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addMediaItem = () => {
    const newItem: MediaItem = {
      url: '',
      type: 'image',
      position: { x: 0, y: 0, width: 300, height: 200 },
      animation: 'fade',
      priority: media.length + 1
    };
    onChange([...media, newItem]);
    setExpandedIndex(media.length);
  };

  const updateMediaItem = (index: number, updates: Partial<MediaItem>) => {
    const updatedMedia = media.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    );
    onChange(updatedMedia);
  };

  const removeMediaItem = (index: number) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    onChange(updatedMedia);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === media.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedMedia = [...media];
    [updatedMedia[index], updatedMedia[newIndex]] = [updatedMedia[newIndex], updatedMedia[index]];
    
    // Update priorities
    updatedMedia.forEach((item, i) => {
      item.priority = i + 1;
    });
    
    onChange(updatedMedia);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Media Gallery (Images & Videos)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMediaItem}
          disabled={media.length >= 10}
        >
          Add Media ({media.length}/10)
        </Button>
      </div>

      <div className="space-y-3">
        {media.map((item, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  {item.type === 'image' ? <Image className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  Media {index + 1} (Priority: {item.priority})
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === media.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    {expandedIndex === index ? '−' : '+'}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMediaItem(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`media-url-${index}`}>URL</Label>
                  <Input
                    id={`media-url-${index}`}
                    value={item.url}
                    onChange={(e) => updateMediaItem(index, { url: e.target.value })}
                    placeholder="https://example.com/media.jpg"
                    type="url"
                  />
                </div>
                <div>
                  <Label htmlFor={`media-type-${index}`}>Type</Label>
                  <Select 
                    value={item.type} 
                    onValueChange={(value: 'image' | 'video') => updateMediaItem(index, { type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">📷 Image</SelectItem>
                      <SelectItem value="video">🎥 Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {expandedIndex === index && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>X Position (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.position.x}
                        onChange={(e) => updateMediaItem(index, {
                          position: { ...item.position, x: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Y Position (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.position.y}
                        onChange={(e) => updateMediaItem(index, {
                          position: { ...item.position, y: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        min="50"
                        max="800"
                        value={item.position.width}
                        onChange={(e) => updateMediaItem(index, {
                          position: { ...item.position, width: parseInt(e.target.value) || 300 }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        min="50"
                        max="600"
                        value={item.position.height}
                        onChange={(e) => updateMediaItem(index, {
                          position: { ...item.position, height: parseInt(e.target.value) || 200 }
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Animation</Label>
                    <Select
                      value={item.animation}
                      onValueChange={(value) => updateMediaItem(index, { animation: value })}
                    >
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

                  {item.url && (
                    <div className="mt-3">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={`Preview ${index + 1}`}
                          className="max-w-full h-32 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="max-w-full h-32 object-cover rounded border"
                          controls
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No media added yet. Click "Add Media" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;