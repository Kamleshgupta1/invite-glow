import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Image, Video, Upload } from 'lucide-react';
import { MediaItem } from '@/types/greeting';
import { animationStyles } from '@/data/eventTypes';

interface AdvancedMediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

const AdvancedMediaUploader = ({ media, onChange }: AdvancedMediaUploaderProps) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);

  const addMedia = (type: 'image' | 'video') => {
    if (media.length < 20) {
      const newMedia: MediaItem = {
        url: '',
        type,
        position: { x: 10, y: 10, width: 300, height: 200 },
        animation: 'fade',
        priority: media.length + 1
      };
      onChange([...media, newMedia]);
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onChange(newMedia);
    setActiveMediaIndex(null);
  };

  const updateMedia = (index: number, field: keyof MediaItem, value: any) => {
    const newMedia = [...media];
    if (field === 'position') {
      newMedia[index] = {
        ...newMedia[index],
        position: { ...newMedia[index].position, ...value }
      };
    } else {
      newMedia[index] = { ...newMedia[index], [field]: value };
    }
    onChange(newMedia);
  };

  const moveMediaPriority = (index: number, direction: 'up' | 'down') => {
    const newMedia = [...media];
    const currentPriority = newMedia[index].priority;
    const targetPriority = direction === 'up' ? currentPriority - 1 : currentPriority + 1;
    
    const targetIndex = newMedia.findIndex(m => m.priority === targetPriority);
    if (targetIndex !== -1) {
      newMedia[index].priority = targetPriority;
      newMedia[targetIndex].priority = currentPriority;
      newMedia.sort((a, b) => a.priority - b.priority);
      onChange(newMedia);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media Content ({media.length}/20)
          </div>
          <div className="flex gap-1">
            <Button
              onClick={() => addMedia('image')}
              disabled={media.length >= 20}
              size="sm"
              variant="outline"
            >
              <Image className="h-3 w-3 mr-1" />
              Image
            </Button>
            <Button
              onClick={() => addMedia('video')}
              disabled={media.length >= 20}
              size="sm"
              variant="outline"
            >
              <Video className="h-3 w-3 mr-1" />
              Video
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {media.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No media content added yet</p>
            <div className="flex gap-2 justify-center mt-2">
              <Button onClick={() => addMedia('image')} variant="outline" size="sm">
                Add Image
              </Button>
              <Button onClick={() => addMedia('video')} variant="outline" size="sm">
                Add Video
              </Button>
            </div>
          </div>
        )}

        {media.map((item, index) => (
          <Card key={index} className={`border ${activeMediaIndex === index ? 'border-primary' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.type === 'image' ? (
                    <Image className="h-3 w-3" />
                  ) : (
                    <Video className="h-3 w-3" />
                  )}
                  <Label className="text-xs font-medium">
                    {item.type === 'image' ? 'Image' : 'Video'} {index + 1} (Priority: {item.priority})
                  </Label>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => moveMediaPriority(index, 'up')}
                    disabled={item.priority === 1}
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                  >
                    ↑
                  </Button>
                  <Button
                    onClick={() => moveMediaPriority(index, 'down')}
                    disabled={item.priority === media.length}
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                  >
                    ↓
                  </Button>
                  <Button
                    onClick={() => setActiveMediaIndex(activeMediaIndex === index ? null : index)}
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                  >
                    {activeMediaIndex === index ? 'Hide' : 'Edit'}
                  </Button>
                  <Button
                    onClick={() => removeMedia(index)}
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">URL</Label>
                <Input
                  value={item.url}
                  onChange={(e) => updateMedia(index, 'url', e.target.value)}
                  placeholder={`Enter ${item.type} URL...`}
                  className="text-sm"
                />
              </div>

              {item.url && (
                <div className="border rounded p-2">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-20 object-cover rounded"
                      controls
                      muted
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              )}

              {activeMediaIndex === index && (
                <div className="space-y-3 border-t pt-3">
                  {/* Position Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X Position (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.position.x}
                        onChange={(e) => updateMedia(index, 'position', { x: parseInt(e.target.value) || 0 })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y Position (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.position.y}
                        onChange={(e) => updateMedia(index, 'position', { y: parseInt(e.target.value) || 0 })}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  {/* Size Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Width (px)</Label>
                      <Input
                        type="number"
                        min="50"
                        max="800"
                        value={item.position.width}
                        onChange={(e) => updateMedia(index, 'position', { width: parseInt(e.target.value) || 300 })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Height (px)</Label>
                      <Input
                        type="number"
                        min="50"
                        max="600"
                        value={item.position.height}
                        onChange={(e) => updateMedia(index, 'position', { height: parseInt(e.target.value) || 200 })}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  {/* Animation and Priority */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Animation</Label>
                      <Select
                        value={item.animation}
                        onValueChange={(value) => updateMedia(index, 'animation', value)}
                      >
                        <SelectTrigger className="h-8 text-xs">
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
                    <div>
                      <Label className="text-xs">Priority</Label>
                      <Input
                        type="number"
                        min="1"
                        max={media.length}
                        value={item.priority}
                        onChange={(e) => updateMedia(index, 'priority', parseInt(e.target.value) || 1)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdvancedMediaUploader;