export interface SiteSettings {
  companyName: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  address: string;
  supportEmail?: string;
  salesEmail?: string;
  social: Record<string, string>;
  announcementBar?: string;
  securityAlertBanner?: string;
  logoUrl?: string;
  footerCopyright?: string;
  certifications?: string[];
  complianceBadges?: string[];
}
