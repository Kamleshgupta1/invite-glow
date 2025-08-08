import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Smile } from 'lucide-react';

import { EmojiItem } from '@/types/background';

interface EmojiSelectorProps {
  emojis: EmojiItem[];
  onChange: (emojis: EmojiItem[]) => void;
}

const EmojiSelector = ({ emojis, onChange }: EmojiSelectorProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const popularEmojis = [
    '😊', '😍', '🥳', '😎', '🤩', '😘', '🥰', '😇',
    '🎉', '🎊', '🎈', '🎁', '🌟', '✨', '💫', '⭐',
    '❤️', '💕', '💖', '💝', '🌹', '🌺', '🌻', '🌸',
    '🎂', '🍰', '🧁', '🍾', '🥂', '🍷', '🍻', '🎯',
    '🏆', '🥇', '🎗️', '🏅', '🎨', '🖼️', '🎭', '🎪'
  ];

  const addEmoji = (selectedEmoji?: string) => {
    const newEmoji: EmojiItem = {
      id: Date.now().toString(),
      emoji: selectedEmoji || '🎉',
      position: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
      size: 24,
      animation: 'bounce'
    };
    onChange([...emojis, newEmoji]);
    setShowPicker(false);
  };

  const removeEmoji = (index: number) => {
    const newEmojis = emojis.filter((_, i) => i !== index);
    onChange(newEmojis);
  };

  const updateEmoji = (index: number, field: keyof EmojiItem, value: any) => {
    const newEmojis = [...emojis];
    if (field === 'position') {
      newEmojis[index] = {
        ...newEmojis[index],
        position: { ...newEmojis[index].position, ...value }
      };
    } else {
      newEmojis[index] = { ...newEmojis[index], [field]: value };
    }
    onChange(newEmojis);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smile className="h-4 w-4" />
            Decorative Emojis ({emojis.length})
          </div>
          <Button
            onClick={() => setShowPicker(!showPicker)}
            size="sm"
            variant="outline"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Emoji
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPicker && (
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <Label className="text-xs">Choose an Emoji</Label>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-1 mb-3">
                {popularEmojis.map((emoji, index) => (
                  <Button
                    key={index}
                    onClick={() => addEmoji(emoji)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-lg hover:bg-primary/10"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Or type any emoji..."
                  className="text-center text-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      addEmoji(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={() => setShowPicker(false)}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {emojis.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Smile className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No decorative emojis added yet</p>
            <Button 
              onClick={() => setShowPicker(true)} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Add Your First Emoji
            </Button>
          </div>
        )}

        {emojis.map((emoji, index) => (
          <Card key={index} className="border">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{emoji.emoji}</span>
                  <Label className="text-xs">Emoji {index + 1}</Label>
                </div>
                <Button
                  onClick={() => removeEmoji(index)}
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">X Position (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={emoji.position.x}
                    onChange={(e) => updateEmoji(index, 'position', { x: parseInt(e.target.value) || 0 })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y Position (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={emoji.position.y}
                    onChange={(e) => updateEmoji(index, 'position', { y: parseInt(e.target.value) || 0 })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Size (px)</Label>
                  <Input
                    type="number"
                    min="12"
                    max="100"
                    value={emoji.size}
                    onChange={(e) => updateEmoji(index, 'size', parseInt(e.target.value) || 24)}
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div className="mt-2">
                <Label className="text-xs">Emoji Input</Label>
                <Input
                  value={emoji.emoji}
                  onChange={(e) => updateEmoji(index, 'emoji', e.target.value)}
                  className="h-7 text-center text-lg"
                  maxLength={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmojiSelector;