export interface RegularPage {
  frontmatter: {
    title: string;
    meta_title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    noindex?: boolean;
    badge?: Badge;
    draft?: boolean;
  };
  slug?: string;
  content?: string;
}

export interface Counter {
  count: string;
  count_suffix: string;
  count_prefix: string;
  count_duration: number;
}

export interface Badge {
  enable: boolean;
  label: string;
  icon?: string;
  images?: string[];
  bg_color?: string;
}

export interface Button {
  enable: boolean;
  label: string;
  link: string;
}

export interface BannerSection {
  title: string;
  content: string;
  image: string;
  testimonial_image: string;
  button_solid: Button;
  button_link: Button;
  badge: Badge & {
    images: string[];
  };
  partners: {
    title: string;
    logos: string[];
  };
  media_section: {
    enable: boolean;
    label: string;
    url: string;
  };
  impact_metrics: {
    label: string;
    description: string;
    counter: Counter;
    team: string[];
    secondary_labels: string[];
  };
}

export interface PromotionCard {
  title: string;
  list: string[];
  counter: Counter;
  button: {
    enable: boolean;
    link: string;
  };
  image?: string;
}

export interface PromotionsSection {
  enable: boolean;
  title: string;
  description: string;
  badge: Badge & {
    icon: string;
    bg_color: string;
  };
  cards: PromotionCard[];
}

export interface MetricItem {
  title: string;
  counter: Counter;
  icon: string;
  bg_color: string;
}

export interface ResultItem {
  title: string;
  subtitle: string;
  image: string;
  image_2: string;
  description: string;
  button?: Button & {
    label: string;
  };
  metrics: MetricItem[];
}

export interface ImpactResultsSection {
  enable: boolean;
  title: string;
  description: string;
  badge: Badge & {
    icon: string;
    bg_color: string;
  };
  results: ResultItem[];
}

export interface SuccessNumbersSection extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    enable: boolean;
    facts: Array<{
      title: string;
      number: string;
      description: string;
      icon: string;
    }>;
  };
}

export interface FeaturesSection extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    enable: boolean;
    features: Array<{
      title: string;
      description: string;
      icon: string;
      button: Button;
    }>;
  };
}

export interface ReviewsSection extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    enable: boolean;
    reviews: Array<{
      name: string;
      avatar: string;
      designation: string;
      content: string;
      rating: number;
      company_logo: string;
    }>;
  };
}

export interface FaqsSection extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    enable: boolean;
    button: Button;
    list: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export interface CtaPrimarySection {
  frontmatter: {
    enable: boolean;
    title: string;
    description: string;
    image: string;
    facts: {
      title: string;
      content: string;
      icon: string;
    }[];
    media_section: {
      enable: boolean;
      label: string;
      url: string;
    };
    dialogues?: string[];
  };
  content: string;
}

export interface CtaSecondarySection extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    enable: boolean;
    buttons: Array<Button>;
    facts: {
      title: string;
      content: string;
      image: string;
      team: string[];
      counter: Counter;
      dialogues: string[];
    };
  };
}

export interface CtaTertiarySection extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    enable: boolean;
    banner_color?: string;
    button: Button;
  };
}

export interface ReviewsSection extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    enable: boolean;
    badge: Badge;
    reviews: Array<{
      name: string;
      avatar: string;
      designation: string;
      content: string;
      rating: number;
      company_logo: string;
    }>;
  };
}

export interface Homepage extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    banner: BannerSection;
    promotions: PromotionsSection;
    impact_results: ImpactResultsSection;
  };
}

export interface ProgramsPage extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    all_programs: {
      title: string;
      description: string;
      badge: {
        enable: boolean;
        label: string;
        icon: string;
        bg_color: string;
      };
    };
    button: Button;
    numbers_banner: {
      enable: boolean;
      title: string;
      description: string;
      badge: Badge & {
        images: string[];
      };
      icon: string;
      bg_color: string;
    };
    metrics: Array<{
      title: string;
      counter: Counter;
    }>;
  };
}

export interface Program extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    date: string;
    end_date?: string;
    categories: string[];
    goal: string;
    raised: string;
    featured: boolean;
  };
}

export interface AboutPage extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    button: Button;
    brands: {
      enable: boolean;
      title?: string;
      logos: string[];
    };
    features: Array<{
      title: string;
      icon: string;
      description?: string;
      button: Button;
    }>;
    numbers_banner: {
      enable: boolean;
      title?: string;
      description?: string;
      badge: Badge;
      metrics: Array<{
        title: string;
        counter: Counter;
      }>;
    };
    impact_results: {
      enable: boolean;
      results: Array<{
        title: string;
        subtitle: string;
        image: string;
        image_2: string;
        description: string;
        button: Button;
        metrics?: Array<{
          title: string;
          counter: Counter;
          image: string;
          bg_color: string;
          icon?: string;
        }>;
      }>;
    };
    team: {
      enable: boolean;
      title: string;
      description: string;
      badge: Badge;
      members: Array<{
        name: string;
        image: string;
        designation: string;
      }>;
    };
  };
}

export interface DonationPage extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    badge: Badge;
    packages: {
      enable: boolean;
      title: string;
      description: string;
      badge: Badge;
      plans: Array<{
        title: string;
        description: string;
        amount: string;
        billed_per?: string;
        button: Button;
      }>;
    };
  };
}

export interface ContactPage extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    badge: Badge;
    cta_banners: Array<{
      title: string;
      description: string;
      banner_color: string;
      button: Button;
    }>;
    contact_form_intro: {
      title: string;
      description: string;
      badge: Badge;
      highlights: Array<{
        title: string;
        icon: string;
        description: string;
      }>;
    };
  };
}

export interface BlogPost extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    date: string;
    categories: string[];
  };
}

export interface BlogPage extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    badge: Badge;
  };
}

export interface TeamMember extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    designation: string;
    name: string;
    isLeadTeam: boolean;
  };
}

export interface TeamsPage extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    badge: Badge;
    team_1: {
      title: string;
      description: string;
    };
    team_2: {
      title: string;
      description: string;
    };
  };
}

export interface ReviewsPage extends RegularPage {
  frontmatter: RegularPage["frontmatter"] & {
    badge: Badge;
  };
}
