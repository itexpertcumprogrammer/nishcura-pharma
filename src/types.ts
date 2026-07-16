export interface WebsiteSettings {
  id: string;
  companyName: string;
  tagline?: string;
  logoText: string;
  email: string;
  email2?: string;
  phone: string;
  phone2?: string;
  address: string;
  websiteUrl?: string;
  whatsappNumber: string;
  facebookUrl: string;
  twitterUrl: string;
  telegramUrl?: string;
  linkedinUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleMapUrl: string;
  googleMapsLink?: string;
  businessHours?: string;
  
  // Custom Navigation Logo & Favicon additions
  logoType?: "image" | "text";
  logoTextSub?: string;
  logoImageDesktop?: string;
  logoImageMobile?: string;
  faviconDesktop?: string;
  faviconMobile?: string;
  logoFontFamily?: string;
  logoColor1?: string;
  logoColor2?: string;
  logoSubtextColor?: string;

  // Custom Footer content additions
  footerAboutText?: string;
  footerPhone?: string;
  footerEmail?: string;
  footerAddress1?: string;
  footerAddress2?: string;
  footerCopyrightText?: string;
  footerPinterestUrl?: string;
  footerLinksCol1Json?: string;
  footerLinksCol2Json?: string;

  // Footer Titles & Icon Settings
  footerCol2Title?: string;
  footerCol3Title?: string;
  footerFollowUsTitle?: string;
  footerAddress1Icon?: string;
  footerAddress2Icon?: string;
  footerPhoneIcon?: string;
  footerEmailIcon?: string;

  // Social Network Show/Hide Switches & Button Backgrounds
  showFacebook?: boolean;
  showInstagram?: boolean;
  showLinkedin?: boolean;
  showPinterest?: boolean;
  socialBgColor?: string;

  // Copyright link bar items
  copyrightLinksJson?: string;

  // Floating widgets config
  showScrollToTopWidget?: boolean;
  scrollTopWidgetBg?: string;
  showWhatsAppWidget?: boolean;
  whatsappMessage?: string;
  whatsappPulseEffect?: boolean;

  // Mobile sticky bottom bar config
  showMobileBottomBar?: boolean;
  mobileLeftLabel?: string;
  mobileLeftPhone?: string;
  mobileLeftBg?: string;
  mobileRightLabel?: string;
  mobileRightPath?: string;
  mobileRightBg?: string;
}

export interface Slide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  composition: string;
  packSize: string;
  packType: string;
  description: string;
  indications: string;
  dosage: string;
  imageUrl: string;
  isFeatured: boolean;
  status: 'active' | 'inactive';
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  detailedContent: string;
  iconName: string; // Lucide icon name
  imageUrl: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  category: string;
  publishedAt: string;
  views: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  productName?: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  qualification: string;
  description: string;
  requirements: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  resumeUrl: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  feedback: string;
  rating: number;
  imageUrl: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  imageUrl: string;
  pdfUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'plant' | 'lab' | 'office' | 'events';
}

export interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  ipAddress: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrator' | 'Editor' | 'Viewer';
  status: 'active' | 'inactive';
}
