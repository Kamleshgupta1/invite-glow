import { useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  flag: string;
  direction?: 'ltr' | 'rtl';
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', direction: 'rtl' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', direction: 'rtl' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹' },
  { code: 'cy', name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
  { code: 'eu', name: 'Euskera', flag: '🇪🇸' },
  { code: 'ca', name: 'Català', flag: '🇪🇸' }
];

// Translations for common greeting terms
const translations: Record<string, Record<string, string>> = {
  'Create Your Greeting': {
    hi: 'अपना अभिवादन बनाएं',
    bn: 'আপনার শুভেচ্ছা তৈরি করুন',
    te: 'మీ శుభాకాంక్షలను సృష్టించండి',
    mr: 'तुमचे अभिवादन तयार करा',
    ta: 'உங்கள் வாழ்த்துக்களை உருவாக்குங்கள்',
    gu: 'તમારા અભિવાદન બનાવો',
    kn: 'ನಿಮ್ಮ ಶುಭಾಶಯಗಳನ್ನು ರಚಿಸಿ',
    ml: 'നിങ്ങളുടെ ആശംസകൾ സൃഷ്ടിക്കുക',
    pa: 'ਆਪਣੀ ਵਧਾਈ ਬਣਾਓ',
    ur: 'اپنا تحیہ بنائیں',
    es: 'Crea tu Saludo',
    fr: 'Créez votre Salutation',
    de: 'Erstellen Sie Ihren Gruß',
    zh: '创建您的问候语',
    ja: 'あいさつを作成',
    ko: '인사말 만들기',
    ar: 'إنشاء تحيتك',
    pt: 'Criar sua Saudação',
    ru: 'Создать приветствие',
    it: 'Crea il tuo Saluto'
  },
  'Beautiful Greetings': {
    hi: 'सुंदर अभिवादन',
    bn: 'সুন্দর শুভেচ্ছা',
    te: 'అందమైన శుభాకాంక్షలు',
    mr: 'सुंदर अभिवादन',
    ta: 'அழகான வாழ்த்துக்கள்',
    gu: 'સુંદર અભિવાદન',
    kn: 'ಸುಂದರ ಶುಭಾಶಯಗಳು',
    ml: 'മനോഹരമായ ആശംസകൾ',
    pa: 'ਸੁੰਦਰ ਵਧਾਈਆਂ',
    ur: 'خوبصورت تحیات',
    es: 'Hermosos Saludos',
    fr: 'Belles Salutations',
    de: 'Schöne Grüße',
    zh: '美丽的问候',
    ja: '美しい挨拶',
    ko: '아름다운 인사말',
    ar: 'تحيات جميلة',
    pt: 'Lindas Saudações',
    ru: 'Красивые Приветствия',
    it: 'Bei Saluti'
  },
  'For': {
    hi: 'के लिए',
    bn: 'জন্য',
    te: 'కోసం',
    mr: 'साठी',
    ta: 'க்காக',
    gu: 'માટે',
    kn: 'ಗಾಗಿ',
    ml: 'വേണ്ടി',
    pa: 'ਲਈ',
    ur: 'کے لیے',
    es: 'Para',
    fr: 'Pour',
    de: 'Für',
    zh: '为了',
    ja: 'のために',
    ko: '을 위해',
    ar: 'لـ',
    pt: 'Para',
    ru: 'Для',
    it: 'Per'
  },
  'With love from': {
    hi: 'प्रेम सहित',
    bn: 'ভালোবাসা সহ',
    te: 'ప్రేమతో',
    mr: 'प्रेमाने',
    ta: 'அன்புடன்',
    gu: 'પ્રેમથી',
    kn: 'ಪ್ರೀತಿಯಿಂದ',
    ml: 'സ്നേഹത്തോടെ',
    pa: 'ਪਿਆਰ ਨਾਲ',
    ur: 'محبت کے ساتھ',
    es: 'Con amor de',
    fr: 'Avec amour de',
    de: 'Mit Liebe von',
    zh: '爱来自',
    ja: '愛をこめて',
    ko: '사랑을 담아',
    ar: 'بحب من',
    pt: 'Com amor de',
    ru: 'С любовью от',
    it: 'Con amore da'
  }
};

export const useLanguageTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Detect user's language from browser or localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) return savedLang;
    
    const browserLang = navigator.language.split('-')[0];
    return languages.find(lang => lang.code === browserLang)?.code || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    // Set document direction for RTL languages
    const language = languages.find(lang => lang.code === currentLanguage);
    if (language?.direction === 'rtl') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    // Set language attribute for better accessibility
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const translate = (key: string): string => {
    return translations[key]?.[currentLanguage] || key;
  };

  const changeLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  return {
    currentLanguage,
    changeLanguage,
    translate,
    languages,
    getCurrentLanguage,
    isRTL: getCurrentLanguage().direction === 'rtl'
  };
};