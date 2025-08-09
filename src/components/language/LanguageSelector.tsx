import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useLanguageTranslation } from '@/hooks/useLanguageTranslation';

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
}

const LanguageSelector = ({ value, onChange }: LanguageSelectorProps) => {
  const { languages } = useLanguageTranslation();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;