export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  canonical?: string;
  lang: string;
}

export const generateSEO = (eventType: string, lang: string = 'en'): SEOData => {
  const seoMap: Record<string, Record<string, SEOData>> = {
    birthday: {
      en: {
        title: 'Beautiful Birthday Greeting Cards | Create & Share Free',
        description: 'Create stunning personalized birthday greeting cards with animations, music, and custom messages. Share beautiful birthday wishes with friends and family.',
        keywords: ['birthday cards', 'birthday greetings', 'personalized cards', 'free birthday cards', 'online greeting cards'],
        ogTitle: 'Beautiful Birthday Greeting Cards - Free & Personalized',
        ogDescription: 'Create and share stunning birthday greeting cards with custom animations, music, and messages.',
        lang: 'en'
      },
      hi: {
        title: 'सुंदर जन्मदिन की शुभकामना कार्ड | मुफ्त बनाएं और साझा करें',
        description: 'एनीमेशन, संगीत और कस्टम संदेशों के साथ शानदार व्यक्तिगत जन्मदिन ग्रीटिंग कार्ड बनाएं।',
        keywords: ['जन्मदिन कार्ड', 'जन्मदिन की शुभकामनाएं', 'व्यक्तिगत कार्ड', 'मुफ्त जन्मदिन कार्ड'],
        ogTitle: 'सुंदर जन्मदिन ग्रीटिंग कार्ड - मुफ्त और व्यक्तिगत',
        ogDescription: 'कस्टम एनीमेशन, संगीत और संदेशों के साथ शानदार जन्मदिन ग्रीटिंग कार्ड बनाएं और साझा करें।',
        lang: 'hi'
      }
    },
    diwali: {
      en: {
        title: 'Diwali Greeting Cards | Festival of Lights Wishes',
        description: 'Create beautiful Diwali greeting cards with traditional designs, animations, and personalized messages for the Festival of Lights.',
        keywords: ['diwali cards', 'diwali greetings', 'festival of lights', 'hindu festival', 'diwali wishes'],
        ogTitle: 'Diwali Greeting Cards - Festival of Lights',
        ogDescription: 'Celebrate Diwali with beautiful, personalized greeting cards featuring traditional designs and animations.',
        lang: 'en'
      },
      hi: {
        title: 'दिवाली ग्रीटिंग कार्ड | रोशनी के त्योहार की शुभकामनाएं',
        description: 'पारंपरिक डिजाइन, एनीमेशन और व्यक्तिगत संदेशों के साथ सुंदर दिवाली ग्रीटिंग कार्ड बनाएं।',
        keywords: ['दिवाली कार्ड', 'दिवाली की शुभकामनाएं', 'रोशनी का त्योहार', 'हिंदू त्योहार'],
        ogTitle: 'दिवाली ग्रीटिंग कार्ड - रोशनी का त्योहार',
        ogDescription: 'पारंपरिक डिजाइन और एनीमेशन के साथ सुंदर, व्यक्तिगत दिवाली ग्रीटिंग कार्ड के साथ दिवाली मनाएं।',
        lang: 'hi'
      }
    },
    christmas: {
      en: {
        title: 'Christmas Greeting Cards | Holiday Wishes & Joy',
        description: 'Create magical Christmas greeting cards with festive animations, holiday music, and warm personalized messages.',
        keywords: ['christmas cards', 'holiday greetings', 'christmas wishes', 'festive cards', 'holiday cards'],
        ogTitle: 'Christmas Greeting Cards - Holiday Magic',
        ogDescription: 'Spread Christmas joy with beautiful, personalized greeting cards featuring festive animations and music.',
        lang: 'en'
      }
    }
  };

  const defaultSEO: SEOData = {
    title: 'Beautiful Greeting Cards | Create & Share Personalized Cards',
    description: 'Create stunning personalized greeting cards for any occasion with animations, music, and custom messages. Share beautiful wishes with friends and family.',
    keywords: ['greeting cards', 'personalized cards', 'online cards', 'free greeting cards', 'custom cards'],
    ogTitle: 'Beautiful Greeting Cards - Free & Personalized',
    ogDescription: 'Create and share stunning greeting cards for any occasion with custom animations, music, and messages.',
    lang: lang
  };

  return seoMap[eventType]?.[lang] || seoMap[eventType]?.['en'] || defaultSEO;
};

export const updatePageSEO = (seoData: SEOData) => {
  // Update document title
  document.title = seoData.title;

  // Update meta tags
  const updateMeta = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  updateMeta('description', seoData.description);
  updateMeta('keywords', seoData.keywords.join(', '));
  updateMeta('og:title', seoData.ogTitle);
  updateMeta('og:description', seoData.ogDescription);
  updateMeta('og:type', 'website');
  
  if (seoData.ogImage) {
    updateMeta('og:image', seoData.ogImage);
  }

  // Update language
  document.documentElement.lang = seoData.lang;

  // Update canonical URL if provided
  if (seoData.canonical) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.canonical);
  }
};