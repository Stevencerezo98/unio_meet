
export interface Link {
    text: string;
    url: string;
}

export interface NavItem {
    text: string;
    url?: string;
    items?: Link[];
}

export interface HeaderContent {
    logo: {
        type: 'text' | 'image';
        value: string;
    };
    navItems: NavItem[];
    ctaPrimary: {
        text: string;
        url: string;
    };
    ctaSecondary: {
        text: string;
        url: string;
    };
}

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

export interface LinkColumn {
    title: string;
    links: Link[];
}

export interface FooterContent {
    brandName: string;
    brandDescription: string;
    socialLinks: SocialLink[];
    linkColumns: LinkColumn[];
    legalLinks: Link[];
    copyright: string;
}

export interface LandingContent {
    header: HeaderContent;
    hero: HeroContent;
    features: FeaturesContent;
    footer: FooterContent;
}
