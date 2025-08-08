import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Frame, Plus, Trash2 } from 'lucide-react';

interface BorderElement {
  id: string;
  type: 'image' | 'emoji';
  content: string;
  position: number; // 0-100 percentage around border
  size: number;
  animation: string;
}

interface BorderSettings {
  enabled: boolean;
  style: string;
  width: number;
  color: string;
  radius: number;
  animation: {
    enabled: boolean;
    type: string;
    speed: number;
  };
  elements: BorderElement[];
}

interface BorderCustomizerProps {
  settings: BorderSettings;
  onChange: (settings: BorderSettings) => void;
}

const BorderCustomizer = ({ settings, onChange }: BorderCustomizerProps) => {
  const updateSettings = (field: keyof BorderSettings, value: any) => {
    if (typeof settings[field] === 'object' && settings[field] !== null) {
      onChange({ ...settings, [field]: { ...settings[field] as object, ...value } });
    } else {
      onChange({ ...settings, [field]: value });
    }
  };

  const addBorderElement = () => {
    if (settings.elements.length >= 5) return;
    
    const newElement: BorderElement = {
      id: Date.now().toString(),
      type: 'emoji',
      content: '⭐',
      position: Math.random() * 100,
      size: 24,
      animation: 'float'
    };
    
    updateSettings('elements', [...settings.elements, newElement]);
  };

  const removeBorderElement = (id: string) => {
    updateSettings('elements', settings.elements.filter(el => el.id !== id));
  };

  const updateBorderElement = (id: string, field: keyof BorderElement, value: any) => {
    const updatedElements = settings.elements.map(el =>
      el.id === id ? { ...el, [field]: value } : el
    );
    updateSettings('elements', updatedElements);
  };

  const borderStyles = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
    { value: 'groove', label: 'Groove' },
    { value: 'ridge', label: 'Ridge' }
  ];

  const animationTypes = [
    { value: 'float', label: 'Float' },
    { value: 'rotate', label: 'Rotate' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'slide', label: 'Slide' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Frame className="h-4 w-4" />
          Border Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Border */}
        <div className="flex items-center justify-between">
          <Label>Enable Border</Label>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings('enabled', enabled)}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Border Style */}
            <div className="space-y-3">
              <Label>Border Style</Label>
              <Select
                value={settings.style}
                onValueChange={(style) => updateSettings('style', style)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {borderStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Border Width */}
            <div className="space-y-3">
              <Label>Border Width ({settings.width}px)</Label>
              <Slider
                value={[settings.width]}
                onValueChange={([width]) => updateSettings('width', width)}
                min={1}
                max={20}
                step={1}
              />
            </div>

            {/* Border Color */}
            <div className="space-y-3">
              <Label>Border Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.color}
                  onChange={(e) => updateSettings('color', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={settings.color}
                  onChange={(e) => updateSettings('color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-3">
              <Label>Border Radius ({settings.radius}px)</Label>
              <Slider
                value={[settings.radius]}
                onValueChange={([radius]) => updateSettings('radius', radius)}
                min={0}
                max={50}
                step={1}
              />
            </div>

            {/* Border Animation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Border Animation</Label>
                <Switch
                  checked={settings.animation.enabled}
                  onCheckedChange={(enabled) => updateSettings('animation', { enabled })}
                />
              </div>
              
              {settings.animation.enabled && (
                <div className="space-y-3 ml-4 border-l-2 pl-4">
                  <div>
                    <Label className="text-xs">Animation Type</Label>
                    <Select
                      value={settings.animation.type}
                      onValueChange={(type) => updateSettings('animation', { type })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="glow">Glow</SelectItem>
                        <SelectItem value="rainbow">Rainbow</SelectItem>
                        <SelectItem value="pulse">Pulse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Speed ({settings.animation.speed}s)</Label>
                    <Slider
                      value={[settings.animation.speed]}
                      onValueChange={([speed]) => updateSettings('animation', { speed })}
                      min={1}
                      max={10}
                      step={0.5}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Border Elements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Border Elements ({settings.elements.length}/5)</Label>
                <Button
                  size="sm"
                  onClick={addBorderElement}
                  disabled={settings.elements.length >= 5}
                  className="h-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              {settings.elements.map((element) => (
                <div key={element.id} className="border rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Select
                      value={element.type}
                      onValueChange={(type) => updateBorderElement(element.id, 'type', type)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emoji">Emoji</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeBorderElement(element.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Input
                    value={element.content}
                    onChange={(e) => updateBorderElement(element.id, 'content', e.target.value)}
                    placeholder={element.type === 'emoji' ? 'Enter emoji' : 'Enter image URL'}
                    className="text-xs"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Position ({element.position.toFixed(0)}%)</Label>
                      <Slider
                        value={[element.position]}
                        onValueChange={([position]) => updateBorderElement(element.id, 'position', position)}
                        min={0}
                        max={100}
                        step={1}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Size ({element.size}px)</Label>
                      <Slider
                        value={[element.size]}
                        onValueChange={([size]) => updateBorderElement(element.id, 'size', size)}
                        min={12}
                        max={48}
                        step={2}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <Select
                    value={element.animation}
                    onValueChange={(animation) => updateBorderElement(element.id, 'animation', animation)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animationTypes.map((anim) => (
                        <SelectItem key={anim.value} value={anim.value}>
                          {anim.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BorderCustomizer;