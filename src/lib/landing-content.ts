
export interface HeroContent {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    cardTitle: string;
    cardDescription: string;
}

export interface FeatureItem {
    icon: string;
    title: string;
    description: string;
}

export interface FeaturesContent {
    title: string;
    subtitle: string;
    items: FeatureItem[];
}

export interface SocialLink {
    name: string;
    url: string;
}

export interface FooterLink {
    text: string;
    url: string;
}

export interface LinkColumn {
    title: string;
    links: FooterLink[];
}

export interface FooterContent {
    brandName: string;
    brandDescription: string;
    socialLinks: SocialLink[];
    linkColumns: LinkColumn[];
    legalLinks: FooterLink[];
    copyright: string;
}

export interface LandingContent {
    hero: HeroContent;
    features: FeaturesContent;
    footer: FooterContent;
}
