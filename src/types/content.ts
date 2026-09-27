export type ProjectCategory =
  | 'architecture'
  | 'interior'
  | 'residential'
  | 'renovation'
  | 'rekhatan'
  | (string & {});

export interface Stat { number: string; label: string; }
export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;
  description: string;
  thumbnail: string;
  images: string[];
}
export interface Service {
  number: string;
  icon: string;
  title: string;
  text: string;
  features: string[];
}
export interface WebsiteContent {
  site: { logo: string; nav_cta: string };
  home: {
    hero: { badge: string; title_line1: string; title_highlight: string; services: string[]; btn_primary: string; btn_secondary: string };
    stats: Stat[];
    featured: { label: string; title_line1: string; title_em: string; cards: Array<{ category: string; title: string; image: string }> };
    philosophy: { image?: string; label: string; title_line1: string; title_em: string; text: string };
    process: { label: string; title_line1: string; title_em: string; steps: Array<{ number: string; title: string; text: string }> };
    testimonial: { label: string; quote: string; author: string };
  };
  projects: Project[];
  about: {
    image?: string;
    label: string;
    lead: string;
    text1: string;
    text2: string;
    stats: Stat[];
    principles: { label: string; title_line1: string; title_em: string; items: Array<{ title: string; text: string }> };
  };
  services: {
    label: string;
    title_line1: string;
    title_em: string;
    description: string;
    items: Service[];
    cta: { label: string; title_line1: string; title_line2: string; title_em: string; text: string; button: string };
  };
  contact: { label: string; lead: string; email: string; phone: string; studios: string; service_options: string[]; budget_options: string[] };
  footer: { logo: string; tagline: string; copyright: string; crafted: string; email: string; phone: string; locations: string; social: string[] };
}
