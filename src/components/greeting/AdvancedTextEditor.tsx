import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Type } from 'lucide-react';
import { TextContent } from '@/types/greeting';
import { animationStyles } from '@/data/eventTypes';

interface AdvancedTextEditorProps {
  texts: TextContent[];
  onChange: (texts: TextContent[]) => void;
}

const AdvancedTextEditor = ({ texts, onChange }: AdvancedTextEditorProps) => {
  const [activeTextIndex, setActiveTextIndex] = useState<number | null>(null);

  const addText = () => {
    if (texts.length < 10) {
    const newText: TextContent = {
      id: Date.now().toString(),
      content: '',
      position: { x: 50, y: 50 },
      style: {
        fontSize: '18px',
        fontWeight: 'normal',
        color: 'hsl(var(--foreground))',
        textAlign: 'center'
      },
      animation: 'fade'
    };
      onChange([...texts, newText]);
    }
  };

  const removeText = (index: number) => {
    const newTexts = texts.filter((_, i) => i !== index);
    onChange(newTexts);
    setActiveTextIndex(null);
  };

  const updateText = (index: number, field: keyof TextContent, value: any) => {
    const newTexts = [...texts];
    if (field === 'position' || field === 'style') {
      newTexts[index] = {
        ...newTexts[index],
        [field]: { ...newTexts[index][field], ...value }
      };
    } else {
      newTexts[index] = { ...newTexts[index], [field]: value };
    }
    onChange(newTexts);
  };

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
  const fontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  const textAligns = ['left', 'center', 'right'] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Text Content ({texts.length}/10)
          </div>
          <Button
            onClick={addText}
            disabled={texts.length >= 10}
            size="sm"
            variant="outline"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Text
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {texts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No text content added yet</p>
            <Button onClick={addText} variant="outline" size="sm" className="mt-2">
              Add Your First Text
            </Button>
          </div>
        )}

        {texts.map((text, index) => (
          <Card key={index} className={`border ${activeTextIndex === index ? 'border-primary' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Text {index + 1}</Label>
                <div className="flex gap-1">
                  <Button
                    onClick={() => setActiveTextIndex(activeTextIndex === index ? null : index)}
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                  >
                    {activeTextIndex === index ? 'Hide' : 'Edit'}
                  </Button>
                  <Button
                    onClick={() => removeText(index)}
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
              <Textarea
                value={text.content}
                onChange={(e) => updateText(index, 'content', e.target.value)}
                placeholder="Enter your text content..."
                rows={2}
                className="text-sm"
              />

              {activeTextIndex === index && (
                <div className="space-y-3 border-t pt-3">
                  {/* Position Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">X Position (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={text.position.x}
                        onChange={(e) => updateText(index, 'position', { x: parseInt(e.target.value) || 0 })}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y Position (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={text.position.y}
                        onChange={(e) => updateText(index, 'position', { y: parseInt(e.target.value) || 0 })}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  {/* Style Controls */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Font Size</Label>
                      <Select
                        value={text.style.fontSize}
                        onValueChange={(value) => updateText(index, 'style', { fontSize: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontSizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Font Weight</Label>
                      <Select
                        value={text.style.fontWeight}
                        onValueChange={(value) => updateText(index, 'style', { fontWeight: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontWeights.map((weight) => (
                            <SelectItem key={weight} value={weight}>{weight}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Text Color</Label>
                      <Input
                        type="color"
                        value={text.style.color.includes('hsl') ? '#000000' : text.style.color}
                        onChange={(e) => updateText(index, 'style', { color: e.target.value })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Text Align</Label>
                      <Select
                        value={text.style.textAlign}
                        onValueChange={(value) => updateText(index, 'style', { textAlign: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {textAligns.map((align) => (
                            <SelectItem key={align} value={align}>{align}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Animation */}
                  <div>
                    <Label className="text-xs">Animation</Label>
                    <Select
                      value={text.animation}
                      onValueChange={(value) => updateText(index, 'animation', value)}
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
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdvancedTextEditor;