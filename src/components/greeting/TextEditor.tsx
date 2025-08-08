import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TextContent } from '@/types/greeting';
import { animationStyles } from '@/data/eventTypes';
import { Trash2, Type, Palette } from 'lucide-react';

interface TextEditorProps {
  texts: TextContent[];
  onChange: (texts: TextContent[]) => void;
}

const TextEditor = ({ texts, onChange }: TextEditorProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addTextContent = () => {
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
    setExpandedIndex(texts.length);
  };

  const updateTextContent = (index: number, updates: Partial<TextContent>) => {
    const updatedTexts = texts.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    );
    onChange(updatedTexts);
  };

  const removeTextContent = (index: number) => {
    const updatedTexts = texts.filter((_, i) => i !== index);
    onChange(updatedTexts);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const fontSizes = [
    { value: '12px', label: 'Small (12px)' },
    { value: '14px', label: 'Regular (14px)' },
    { value: '18px', label: 'Medium (18px)' },
    { value: '24px', label: 'Large (24px)' },
    { value: '32px', label: 'X-Large (32px)' },
    { value: '48px', label: 'XX-Large (48px)' }
  ];

  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '300', label: 'Light' },
    { value: '600', label: 'Semi Bold' }
  ];

  const colors = [
    { value: 'hsl(var(--foreground))', label: 'Default' },
    { value: 'hsl(var(--primary))', label: 'Primary' },
    { value: 'hsl(var(--secondary))', label: 'Secondary' },
    { value: 'hsl(var(--muted-foreground))', label: 'Muted' },
    { value: 'hsl(0 0% 100%)', label: 'White' },
    { value: 'hsl(0 0% 0%)', label: 'Black' },
    { value: 'hsl(0 70% 50%)', label: 'Red' },
    { value: 'hsl(120 60% 40%)', label: 'Green' },
    { value: 'hsl(220 90% 50%)', label: 'Blue' },
    { value: 'hsl(45 90% 50%)', label: 'Yellow' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Text Content (Messages)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTextContent}
          disabled={texts.length >= 5}
        >
          Add Text ({texts.length}/5)
        </Button>
      </div>

      <div className="space-y-3">
        {texts.map((text, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Text {index + 1}
                </div>
                <div className="flex gap-1">
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
                    onClick={() => removeTextContent(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor={`text-content-${index}`}>Message</Label>
                <Textarea
                  id={`text-content-${index}`}
                  value={text.content}
                  onChange={(e) => updateTextContent(index, { content: e.target.value })}
                  placeholder="Enter your message"
                  rows={3}
                />
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
                        value={text.position.x}
                        onChange={(e) => updateTextContent(index, {
                          position: { ...text.position, x: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Y Position (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={text.position.y}
                        onChange={(e) => updateTextContent(index, {
                          position: { ...text.position, y: parseInt(e.target.value) || 0 }
                        })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Font Size</Label>
                      <Select
                        value={text.style.fontSize}
                        onValueChange={(value) => updateTextContent(index, {
                          style: { ...text.style, fontSize: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontSizes.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Font Weight</Label>
                      <Select
                        value={text.style.fontWeight}
                        onValueChange={(value) => updateTextContent(index, {
                          style: { ...text.style, fontWeight: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontWeights.map((weight) => (
                            <SelectItem key={weight.value} value={weight.value}>
                              {weight.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Text Color</Label>
                      <Select
                        value={text.style.color}
                        onValueChange={(value) => updateTextContent(index, {
                          style: { ...text.style, color: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded border" 
                                  style={{ backgroundColor: color.value.replace('hsl(var(--', 'hsl(var(--').replace('))', '))') }}
                                />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Text Align</Label>
                      <Select
                        value={text.style.textAlign}
                        onValueChange={(value: 'left' | 'center' | 'right') => updateTextContent(index, {
                          style: { ...text.style, textAlign: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Animation</Label>
                    <Select
                      value={text.animation}
                      onValueChange={(value) => updateTextContent(index, { animation: value })}
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

                  {text.content && (
                    <div className="mt-3 p-3 border rounded">
                      <Label className="text-xs text-muted-foreground">Preview:</Label>
                      <div
                        style={{
                          fontSize: text.style.fontSize,
                          fontWeight: text.style.fontWeight,
                          color: text.style.color,
                          textAlign: text.style.textAlign
                        }}
                        className="mt-1"
                      >
                        {text.content}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {texts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No text content added yet. Click "Add Text" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TextEditor;