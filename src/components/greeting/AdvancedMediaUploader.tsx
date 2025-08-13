import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Image, Video, Upload, ChevronUp, ChevronDown, Settings, X } from 'lucide-react';
import { MediaItem } from '@/types/greeting';
import { animationStyles } from '@/data/eventTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedMediaUploaderProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  maxItems?: number;
}

const MAX_ITEMS = 20;

const AdvancedMediaUploader = ({ 
  media, 
  onChange, 
  maxItems = MAX_ITEMS 
}: AdvancedMediaUploaderProps) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    // Reset active index if it's out of bounds
    if (activeMediaIndex !== null && activeMediaIndex >= media.length) {
      setActiveMediaIndex(null);
    }
  }, [media.length, activeMediaIndex]);

  const addMedia = (type: 'image' | 'video') => {
    if (media.length < maxItems) {
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        url: '',
        type,
        position: { x: 10, y: 10, width: 300, height: 200 },
        animation: 'fade',
        priority: media.length + 1
      };
      onChange([...media, newMedia]);
      setActiveMediaIndex(media.length); // Auto-open the new media
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onChange(newMedia);
    if (activeMediaIndex === index) {
      setActiveMediaIndex(null);
    } else if (activeMediaIndex !== null && activeMediaIndex > index) {
      setActiveMediaIndex(activeMediaIndex - 1);
    }
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
    if (index < 0 || index >= media.length) return;
    
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

  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    
    const newMedia = [...media];
    const draggedItem = newMedia[dragIndex];
    newMedia.splice(dragIndex, 1);
    newMedia.splice(index, 0, draggedItem);
    
    // Update priorities
    newMedia.forEach((item, idx) => {
      item.priority = idx + 1;
    });
    
    onChange(newMedia);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const validateUrl = (url: string, type: 'image' | 'video') => {
    if (!url) return { valid: false, message: 'URL is required' };
    
    try {
      new URL(url);
    } catch {
      return { valid: false, message: 'Invalid URL format' };
    }
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    
    const extension = url.substring(url.lastIndexOf('.')).toLowerCase();
    
    if (type === 'image' && !imageExtensions.includes(extension)) {
      return { valid: false, message: 'Not a valid image URL' };
    }
    
    if (type === 'video' && !videoExtensions.includes(extension)) {
      return { valid: false, message: 'Not a valid video URL' };
    }
    
    return { valid: true, message: '' };
  };

  const usagePercentage = Math.round((media.length / maxItems) * 100);

  return (
    <Card className="border border-pink-300 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-4">
  <div className="flex items-center gap-2 min-w-0">
    <div className="relative shrink-0">
      <Image className="h-4 w-4" />
      <Video className="h-3 w-3 absolute -bottom-1 -right-1 bg-background rounded-full p-0.5" />
    </div>
    <span className="text-sm font-medium truncate">Media Content</span>
    <Badge 
      className={`shrink-0 ml-1 ${
        media.length === maxItems 
          ? "bg-destructive/10 text-destructive" 
          : "bg-primary/10 text-primary"
      }`}
    >
      {media.length}/{maxItems}
    </Badge>
  </div>
  
  <div className="flex gap-2 justify-end xs:justify-normal">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => addMedia('image')}
            disabled={media.length >= maxItems}
            size="sm"
            variant={media.length === 0 ? "default" : "outline"}
            className={`gap-1 min-w-[100px] ${
              media.length === 0 
                ? "bg-primary/50 hover:bg-primary/80" 
                : ""
            }`}
          >
            <Image className="h-3.5 w-3.5" />
            <span className="truncate">
              {media.length > 0 ? 'Add More' : 'Add Image'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {media.length >= maxItems 
            ? 'Maximum media limit reached' 
            : (media.length > 0 ? 'Add another image' : 'Add first image')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => addMedia('video')}
            disabled={media.length >= maxItems}
            size="sm"
            variant={media.length === 0 ? "default" : "outline"}
            className={`gap-1 min-w-[100px] ${
              media.length === 0 
                ? "bg-primary/50 hover:bg-primary/90" 
                : ""
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span className="truncate">
              {media.length > 0 ? 'Add More' : 'Add Video'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {media.length >= maxItems 
            ? 'Maximum media limit reached' 
            : (media.length > 0 ? 'Add another video' : 'Add first video')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</div>
        <div className="mt-3">
          <Progress value={usagePercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>
              {media.length > 0 ? 
                `${media.length} item${media.length !== 1 ? 's' : ''} added` : 
                'No media added yet'}
            </span>
            {media.length >= maxItems && (
              <span className="text-destructive">Limit reached</span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {media.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 rounded-lg border border-dashed border-border/50 bg-muted/20"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">No media content added yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1 mb-3">
              Add images or videos to get started
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => addMedia('image')} 
                variant="default"
                size="sm"
                className="gap-1"
              >
                <Image className="h-3.5 w-3.5" />
                Add Image
              </Button>
              <Button 
                onClick={() => addMedia('video')} 
                variant="default" 
                size="sm"
                className="gap-1"
              >
                <Video className="h-3.5 w-3.5" />
                Add Video
              </Button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {media.map((item, index) => {
              const urlValidation = validateUrl(item.url, item.type);
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: dragIndex === index ? 1.02 : 1,
                    boxShadow: dragIndex === index ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                >
                  <Card 
                    className={`border transition-all ${
                      activeMediaIndex === index ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50'
                    } ${
                      dragIndex === index ? 'bg-primary/5' : ''
                    }`}
                  >
                    <CardHeader className="pb-2 pt-3 px-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div 
                            className={`p-1 rounded-md ${
                              item.type === 'image' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'
                            }`}
                          >
                            {item.type === 'image' ? (
                              <Image className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            ) : (
                              <Video className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            )}
                          </div>
                          
                          <div className="overflow-hidden">
                            <Label className="text-xs font-medium truncate">
                              {item.type === 'image' ? 'Image' : 'Video'} {index + 1}
                            </Label>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.url ? item.url : 'No URL provided'}
                            </p>
                          </div>
                          
                          {!urlValidation.valid && item.url && (
                            <Badge variant="destructive" className="text-xs">
                              Invalid
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => moveMediaPriority(index, 'up')}
                                  disabled={item.priority === 1}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                >
                                  <ChevronUp className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Move up</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => moveMediaPriority(index, 'down')}
                                  disabled={item.priority === media.length}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                >
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Move down</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => setActiveMediaIndex(activeMediaIndex === index ? null : index)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                >
                                  {activeMediaIndex === index ? (
                                    <X className="h-3.5 w-3.5" />
                                  ) : (
                                    <Settings className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {activeMediaIndex === index ? 'Close settings' : 'Open settings'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => removeMedia(index)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove media</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 px-3 pb-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-xs">Media URL</Label>
                          {!urlValidation.valid && item.url && (
                            <span className="text-xs text-destructive">
                              {urlValidation.message}
                            </span>
                          )}
                        </div>
                        <Input
                          value={item.url}
                          onChange={(e) => updateMedia(index, 'url', e.target.value)}
                          placeholder={`Enter ${item.type} URL...`}
                          className="text-sm"
                        />
                       
                      </div>

                      {item.url && (
                        <div className="border rounded p-2 bg-muted/20">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={`Preview ${index + 1}`}
                              className={`w-full h-24 object-contain rounded ${
                                !urlValidation.valid ? 'opacity-50' : ''
                              }`}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'text-center py-4 text-muted-foreground text-xs';
                                errorMsg.textContent = 'Failed to load image';
                                e.currentTarget.parentNode?.appendChild(errorMsg);
                              }}
                            />
                          ) : (
                            <video
                              src={item.url}
                              className={`w-full h-24 object-contain rounded ${
                                !urlValidation.valid ? 'opacity-50' : ''
                              }`}
                              controls
                              muted
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'text-center py-4 text-muted-foreground text-xs';
                                errorMsg.textContent = 'Failed to load video';
                                e.currentTarget.parentNode?.appendChild(errorMsg);
                              }}
                            />
                          )}
                        </div>
                      )}

                      <AnimatePresence>
                        {activeMediaIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3 border-t pt-3 overflow-hidden"
                          >
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedMediaUploader;