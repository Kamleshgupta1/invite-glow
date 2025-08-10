import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Frame, Plus, Trash2 } from 'lucide-react';
import { BorderSettings, BorderElement } from '@/types/background';

interface BorderCustomizerProps {
  settings: BorderSettings;
  onChange: (settings: BorderSettings) => void;
}

const BorderCustomizer = ({ settings, onChange }: BorderCustomizerProps) => {
  console.log('BorderCustomizer settings:', settings);
  console.log('decorativeElements type:', typeof settings.decorativeElements, settings.decorativeElements);
  const updateSettings = (field: keyof BorderSettings, value: any) => {
    if (typeof settings[field] === 'object' && settings[field] !== null) {
      onChange({ ...settings, [field]: { ...settings[field] as object, ...value } });
    } else {
      onChange({ ...settings, [field]: value });
    }
  };

  const addBorderElement = () => {
    const elements = Array.isArray(settings.decorativeElements) ? settings.decorativeElements : [];
    if (elements.length >= 5) return;
    
    const newElement: BorderElement = {
      id: Date.now().toString(),
      type: 'emoji',
      content: '⭐',
      position: Math.random() * 100,
      size: 24,
      animation: 'float'
    };
    
    updateSettings('decorativeElements', [...elements, newElement]);
  };

  const removeBorderElement = (id: string) => {
    const elements = Array.isArray(settings.decorativeElements) ? settings.decorativeElements : [];
    updateSettings('decorativeElements', elements.filter(el => el.id !== id));
  };

  const updateBorderElement = (id: string, field: keyof BorderElement, value: any) => {
    const elements = Array.isArray(settings.decorativeElements) ? settings.decorativeElements : [];
    const updatedElements = elements.map(el =>
      el.id === id ? { ...el, [field]: value } : el
    );
    updateSettings('decorativeElements', updatedElements);
  };

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
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
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
              <Input
                type="color"
                value={settings.color}
                onChange={(e) => updateSettings('color', e.target.value)}
                className="w-full h-10"
              />
            </div>

            {/* Border Elements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Border Elements ({Array.isArray(settings.decorativeElements) ? settings.decorativeElements.length : 0}/5)</Label>
                <Button
                  size="sm"
                  onClick={addBorderElement}
                  disabled={Array.isArray(settings.decorativeElements) ? settings.decorativeElements.length >= 5 : false}
                  className="h-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              {Array.isArray(settings.decorativeElements) ? settings.decorativeElements.map((element) => (
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
                </div>
              )) : null}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BorderCustomizer;