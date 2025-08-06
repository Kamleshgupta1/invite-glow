import { EventType } from '@/types/greeting';

export const eventTypes: EventType[] = [
  // Birthday Category
  { 
    value: 'birthday', 
    label: 'Birthday', 
    emoji: '🎂', 
    defaultMessage: 'Wishing you a fantastic birthday filled with joy and happiness!', 
    theme: 'card-birthday',
    category: 'birthday'
  },
  { 
    value: 'sweet-sixteen', 
    label: 'Sweet Sixteen', 
    emoji: '🎈', 
    defaultMessage: 'Sweet sixteen and never been so amazing! Happy Birthday!', 
    theme: 'card-birthday',
    category: 'birthday'
  },
  { 
    value: 'milestone-birthday', 
    label: 'Milestone Birthday', 
    emoji: '🎉', 
    defaultMessage: 'Celebrating this amazing milestone in your life!', 
    theme: 'card-birthday',
    category: 'birthday'
  },

  // Religious Festivals
  { 
    value: 'diwali', 
    label: 'Diwali', 
    emoji: '🪔', 
    defaultMessage: 'May this festival of lights illuminate your path to happiness and prosperity!', 
    theme: 'card-diwali',
    category: 'religious'
  },
  { 
    value: 'holi', 
    label: 'Holi', 
    emoji: '🌈', 
    defaultMessage: 'May your life be filled with colors of joy, happiness, and love!', 
    theme: 'card-holi',
    category: 'religious'
  },
  { 
    value: 'eid', 
    label: 'Eid', 
    emoji: '🌙', 
    defaultMessage: 'Eid Mubarak! May this blessed day bring you peace and happiness!', 
    theme: 'card-eid',
    category: 'religious'
  },
  { 
    value: 'christmas', 
    label: 'Christmas', 
    emoji: '🎄', 
    defaultMessage: 'Merry Christmas! May your holidays be merry and bright!', 
    theme: 'card-christmas',
    category: 'religious'
  },
  { 
    value: 'navratri', 
    label: 'Navratri', 
    emoji: '💃', 
    defaultMessage: 'May Maa Durga bless you with strength, prosperity, and happiness!', 
    theme: 'card-navratri',
    category: 'religious'
  },
  { 
    value: 'ramadan', 
    label: 'Ramadan', 
    emoji: '🕌', 
    defaultMessage: 'Ramadan Mubarak! May this holy month bring you spiritual growth and peace!', 
    theme: 'card-ramadan',
    category: 'religious'
  },
  { 
    value: 'karwa-chauth', 
    label: 'Karwa Chauth', 
    emoji: '🌙', 
    defaultMessage: 'May your love grow stronger with each passing moon!', 
    theme: 'card-karwa-chauth',
    category: 'religious'
  },
  { 
    value: 'raksha-bandhan', 
    label: 'Raksha Bandhan', 
    emoji: '🧿', 
    defaultMessage: 'Celebrating the beautiful bond of love and protection!', 
    theme: 'card-raksha-bandhan',
    category: 'religious'
  },

  // National Holidays
  { 
    value: 'independence-day', 
    label: 'Independence Day', 
    emoji: '🇮🇳', 
    defaultMessage: 'Celebrating the spirit of freedom and unity! Happy Independence Day!', 
    theme: 'card-independence',
    category: 'national'
  },
  { 
    value: 'republic-day', 
    label: 'Republic Day', 
    emoji: '🏛️', 
    defaultMessage: 'Honoring our constitution and democratic values! Happy Republic Day!', 
    theme: 'card-republic',
    category: 'national'
  },
  { 
    value: 'gandhi-jayanti', 
    label: 'Gandhi Jayanti', 
    emoji: '🕊️', 
    defaultMessage: 'Remembering the Father of our Nation and his teachings of peace!', 
    theme: 'card-gandhi',
    category: 'national'
  },

  // Seasonal Festivals
  { 
    value: 'makar-sankranti', 
    label: 'Makar Sankranti', 
    emoji: '🪁', 
    defaultMessage: 'May your dreams soar high like colorful kites in the sky!', 
    theme: 'card-makar-sankranti',
    category: 'seasonal'
  },
  { 
    value: 'baisakhi', 
    label: 'Baisakhi', 
    emoji: '🌾', 
    defaultMessage: 'May this harvest festival bring prosperity and joy to your life!', 
    theme: 'card-baisakhi',
    category: 'seasonal'
  },
  { 
    value: 'onam', 
    label: 'Onam', 
    emoji: '🌺', 
    defaultMessage: 'May King Mahabali bless you with happiness and prosperity!', 
    theme: 'card-onam',
    category: 'seasonal'
  },
  { 
    value: 'pongal', 
    label: 'Pongal', 
    emoji: '🍯', 
    defaultMessage: 'May this harvest festival sweeten your life with joy!', 
    theme: 'card-pongal',
    category: 'seasonal'
  },

  // Personal Milestones
  { 
    value: 'anniversary', 
    label: 'Anniversary', 
    emoji: '💍', 
    defaultMessage: 'Celebrating your special day and the beautiful journey you share together!', 
    theme: 'card-anniversary',
    category: 'personal'
  },
  { 
    value: 'retirement', 
    label: 'Retirement', 
    emoji: '👴', 
    defaultMessage: 'Congratulations on your well-deserved retirement! Enjoy this new chapter!', 
    theme: 'card-retirement',
    category: 'personal'
  },
  { 
    value: 'promotion', 
    label: 'Promotion', 
    emoji: '📈', 
    defaultMessage: 'Congratulations on your promotion! Your hard work has truly paid off!', 
    theme: 'card-promotion',
    category: 'personal'
  },
  { 
    value: 'farewell', 
    label: 'Farewell', 
    emoji: '👋', 
    defaultMessage: 'Wishing you all the best in your new journey. You will be missed!', 
    theme: 'card-farewell',
    category: 'personal'
  },
  { 
    value: 'graduation', 
    label: 'Graduation', 
    emoji: '🎓', 
    defaultMessage: 'Congratulations graduate! Your achievements are truly inspiring!', 
    theme: 'card-graduation',
    category: 'personal'
  },
  { 
    value: 'wedding', 
    label: 'Wedding', 
    emoji: '💒', 
    defaultMessage: 'Wishing you a lifetime of love, laughter, and happiness together!', 
    theme: 'card-wedding',
    category: 'personal'
  },
  { 
    value: 'new-baby', 
    label: 'New Baby', 
    emoji: '👶', 
    defaultMessage: 'Congratulations on your bundle of joy! Welcome to parenthood!', 
    theme: 'card-baby',
    category: 'personal'
  },
  { 
    value: 'new-home', 
    label: 'New Home', 
    emoji: '🏠', 
    defaultMessage: 'Congratulations on your new home! May it be filled with love and laughter!', 
    theme: 'card-home',
    category: 'personal'
  },

  // Custom
  { 
    value: 'custom', 
    label: 'Custom Event', 
    emoji: '✨', 
    defaultMessage: 'Sending you warm wishes and positive vibes!', 
    theme: 'card-custom',
    category: 'custom'
  }
];

export const animationStyles = [
  { value: 'fade', label: 'Fade In' },
  { value: 'slide', label: 'Slide In' },
  { value: 'zoom', label: 'Zoom In' },
  { value: 'flip', label: 'Flip In' },
  { value: 'bounce', label: 'Bounce In' },
  { value: 'rotate', label: 'Rotate In' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'shake', label: 'Shake' },
  { value: 'swing', label: 'Swing' },
  { value: 'tada', label: 'Tada' }
];

export const layoutStyles = [
  { value: 'grid', label: 'Grid Layout' },
  { value: 'masonry', label: 'Masonry Layout' },
  { value: 'carousel', label: 'Carousel Layout' },
  { value: 'stack', label: 'Stack Layout' },
  { value: 'collage', label: 'Collage Layout' }
];